import type { Plugin, Connect } from 'vite';
import { startWikiSyncWorker, stopWikiSyncWorker, getWikiSyncStatus, triggerWikiSync } from './wikiSyncWorker.ts';

interface AuctionItem {
  readonly itemId: string;
  readonly startingPrice: number;
  readonly highestBidAmount: number;
  readonly category: string;
  readonly ended: boolean;
}

export interface LiveAuctionPriceSummary {
  readonly minPrice: number;
  readonly avgPrice: number;
  readonly maxPrice: number;
  readonly count: number;
}

export interface LivePricingPayload {
  readonly timestamp: number;
  readonly auctions: Record<string, LiveAuctionPriceSummary>;
  readonly bazaar?: Record<string, { avgPrice: number; weeklyAveragePrice: number }>;
  readonly totalLiveAuctions: number;
}

export function livePricingPlugin(apiKey: string): Plugin {
  let cachedPayload: LivePricingPayload | null = null;
  let lastFetchTime = 0;
  let inFlightFetch: Promise<LivePricingPayload | null> | null = null;
  const CACHE_DURATION_MS = 5 * 60 * 1000;

  async function executeFetch(): Promise<LivePricingPayload | null> {
    try {
      const headers: Record<string, string> = apiKey ? { 'X-API-Key': apiKey } : {};
      const firstRes = await fetch('https://api.craftersmc.net/v1/skyblock/auctions?page=0', {
        headers,
        signal: AbortSignal.timeout(10000)
      });
      if (!firstRes.ok) return cachedPayload;

      const firstData = await firstRes.json();
      let allAuctions: AuctionItem[] = firstData.auctions || [];
      const totalPages = Number(firstData.totalPages) || 1;

      if (totalPages > 1) {
        for (let p = 1; p < Math.min(totalPages, 5); p++) {
          await new Promise(r => setTimeout(r, 200)); // Pace auction page requests
          const res = await fetch(`https://api.craftersmc.net/v1/skyblock/auctions?page=${p}`, {
            headers,
            signal: AbortSignal.timeout(10000)
          });
          if (res.ok) {
            const pageData = await res.json();
            if (Array.isArray(pageData.auctions)) {
              allAuctions = allAuctions.concat(pageData.auctions);
            }
          }
        }
      }

      const accessoryAuctions = allAuctions.filter(
        a =>
          (a.category === 'ACCESSORIES' ||
            a.itemId?.toLowerCase().includes('talisman') ||
            a.itemId?.toLowerCase().includes('ring') ||
            a.itemId?.toLowerCase().includes('artifact')) &&
          !a.ended
      );

      const byItem: Record<string, number[]> = {};
      for (const a of accessoryAuctions) {
        if (!a.itemId) continue;
        const normalized = a.itemId.toUpperCase().replace(/^TRPIXEL:/, '').trim();
        const price = (a.highestBidAmount && a.highestBidAmount > 0) ? a.highestBidAmount : (a.startingPrice || 0);
        if (price > 0) {
          if (!byItem[normalized]) byItem[normalized] = [];
          byItem[normalized].push(price);
        }
      }

      const summaryMap: Record<string, LiveAuctionPriceSummary> = {};
      for (const [id, prices] of Object.entries(byItem)) {
        const sorted = prices.slice().sort((a, b) => a - b);
        const effective = sorted.length >= 4 ? sorted.slice(1, -1) : sorted;
        const minPrice = effective[0];
        const maxPrice = effective[effective.length - 1];
        const avgPrice = Math.round(effective.reduce((sum, p) => sum + p, 0) / effective.length);

        summaryMap[id] = {
          minPrice,
          avgPrice,
          maxPrice,
          count: prices.length
        };
      }

      const bazaarMap: Record<string, { avgPrice: number; weeklyAveragePrice: number }> = {
        fused_remnants: { avgPrice: 6400000, weeklyAveragePrice: 6400000 },
        remnant_of_the_eye: { avgPrice: 200000, weeklyAveragePrice: 200000 }
      };
      const keyBazaarItems = [
        'condensed_fermento',
        'fermento',
        'squash',
        'cropie',
        'fire_fragment',
        'spooky_fragment',
        'golden_feather',
        'glacial_fang',
        'tessellated_ender_pearl',
        'ectoplasm',
        'enchanted_packed_ice',
        'enchanted_iron_block',
        'enchanted_lava_bucket'
      ];
      for (const item of keyBazaarItems) {
        try {
          await new Promise(r => setTimeout(r, 150)); // Pace bazaar requests
          const bRes = await fetch(`https://api.craftersmc.net/v1/skyblock/bazaar/${item}/details`, {
            headers,
            signal: AbortSignal.timeout(10000)
          });
          if (bRes.ok) {
            const bData = await bRes.json();
            const avg = Number(bData.weeklyAveragePrice) || Number(bData.buyTopEntries?.[0]?.price) || 0;
            if (avg > 0) {
              bazaarMap[item] = { avgPrice: avg, weeklyAveragePrice: avg };
            }
          }
        } catch {
          // ignore individual item errors
        }
      }

      cachedPayload = {
        timestamp: Date.now(),
        auctions: summaryMap,
        bazaar: bazaarMap,
        totalLiveAuctions: accessoryAuctions.length
      };
      lastFetchTime = Date.now();
      return cachedPayload;
    } catch {
      return cachedPayload;
    }
  }

  async function fetchLiveAuctions(): Promise<LivePricingPayload | null> {
    if (cachedPayload && Date.now() - lastFetchTime < CACHE_DURATION_MS) {
      return cachedPayload;
    }
    if (inFlightFetch) {
      return inFlightFetch;
    }
    inFlightFetch = executeFetch().finally(() => {
      inFlightFetch = null;
    });
    return inFlightFetch;
  }

  const handler: Connect.NextHandleFunction = (req, res, next) => {
    const url = req.url?.split('?')[0];

    // Handle CORS preflight cleanly
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
      res.statusCode = 204;
      res.end();
      return;
    }

    if (url === '/api/pricing/live' || url === '/api/v1/pricing/live') {
      void (async () => {
        try {
          const data = await fetchLiveAuctions();
          if (!res.writableEnded && !res.destroyed) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            if (data) {
              res.end(JSON.stringify({ success: true, ...data }));
            } else {
              res.end(JSON.stringify({ success: false, fallback: true }));
            }
          }
        } catch (err) {
          if (!res.writableEnded && !res.destroyed) {
            try {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: String(err) }));
            } catch {
              // ignore
            }
          }
        }
      })();
      return;
    }

    if (url === '/api/wiki/status') {
      if (!res.writableEnded && !res.destroyed) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify(getWikiSyncStatus()));
      }
      return;
    }

    if (url === '/api/wiki/sync') {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Allow', 'POST');
        res.end(JSON.stringify({ success: false, error: 'Method Not Allowed. Use POST.' }));
        return;
      }

      void (async () => {
        try {
          const result = await triggerWikiSync();
          if (!res.writableEnded && !res.destroyed) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(result));
          }
        } catch (err) {
          if (!res.writableEnded && !res.destroyed) {
            try {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: String(err) }));
            } catch {
              // ignore
            }
          }
        }
      })();
      return;
    }

    next();
  };

  return {
    name: 'craftersmc-live-pricing',
    configureServer(server) {
      startWikiSyncWorker();
      server.httpServer?.on('close', () => {
        stopWikiSyncWorker();
      });
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      startWikiSyncWorker();
      server.httpServer?.on('close', () => {
        stopWikiSyncWorker();
      });
      server.middlewares.use(handler);
    }
  };
}
