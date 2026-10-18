import type { Plugin, Connect } from 'vite';
import { startWikiSyncWorker, getWikiSyncStatus, triggerWikiSync } from './wikiSyncWorker.ts';

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
  const CACHE_DURATION_MS = 5 * 60 * 1000;

  async function fetchLiveAuctions(): Promise<LivePricingPayload | null> {
    if (cachedPayload && Date.now() - lastFetchTime < CACHE_DURATION_MS) {
      return cachedPayload;
    }

    try {
      const headers: Record<string, string> = apiKey ? { 'X-API-Key': apiKey } : {};
      const firstRes = await fetch('https://api.craftersmc.net/v1/skyblock/auctions?page=0', { headers });
      if (!firstRes.ok) return cachedPayload;

      const firstData = await firstRes.json();
      let allAuctions: AuctionItem[] = firstData.auctions || [];
      const totalPages = Number(firstData.totalPages) || 1;

      if (totalPages > 1) {
        for (let p = 1; p < Math.min(totalPages, 5); p++) {
          const res = await fetch(`https://api.craftersmc.net/v1/skyblock/auctions?page=${p}`, { headers });
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
        const price = a.startingPrice || a.highestBidAmount;
        if (price > 0) {
          if (!byItem[normalized]) byItem[normalized] = [];
          byItem[normalized].push(price);
        }
      }

      const summaryMap: Record<string, LiveAuctionPriceSummary> = {};
      for (const [id, prices] of Object.entries(byItem)) {
        const sorted = prices.slice().sort((a, b) => a - b);
        const effective = sorted.length >= 4 ? sorted.slice(1, -1) : sorted;
        const minPrice = Math.min(...effective);
        const maxPrice = Math.max(...effective);
        const avgPrice = Math.round(effective.reduce((sum, p) => sum + p, 0) / effective.length);

        summaryMap[id] = {
          minPrice,
          avgPrice,
          maxPrice,
          count: prices.length
        };
      }

      const bazaarMap: Record<string, { avgPrice: number; weeklyAveragePrice: number }> = {};
      const keyBazaarItems = [
        'condensed_fermento',
        'fermento',
        'squash',
        'cropie',
        'fused_remnants',
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
          const bRes = await fetch(`https://api.craftersmc.net/v1/skyblock/bazaar/${item}/details`, { headers });
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

  const handler: Connect.NextHandleFunction = (req, res, next) => {
    const url = req.url?.split('?')[0];
    if (url === '/api/pricing/live' || url === '/api/v1/pricing/live') {
      void (async () => {
        const data = await fetchLiveAuctions();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (data) {
          res.end(JSON.stringify({ success: true, ...data }));
        } else {
          res.end(JSON.stringify({ success: false, fallback: true }));
        }
      })();
      return;
    }
    if (url === '/api/wiki/status') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(JSON.stringify(getWikiSyncStatus()));
      return;
    }
    if (url === '/api/wiki/sync') {
      void (async () => {
        const result = await triggerWikiSync();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify(result));
      })();
      return;
    }
    next();
  };

  return {
    name: 'craftersmc-live-pricing',
    configureServer(server) {
      startWikiSyncWorker();
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      startWikiSyncWorker();
      server.middlewares.use(handler);
    }
  };
}
