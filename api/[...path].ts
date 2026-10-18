import type { IncomingMessage, ServerResponse } from 'http';
import pricingSnapshot from '../src/data/pricingSnapshot.json';

interface VercelRequest extends IncomingMessage {
  query?: Record<string, string | string[]>;
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (jsonBody: unknown) => void;
  send: (body: unknown) => void;
}

const TARGET_API_BASE = 'https://api.craftersmc.net';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const urlPath = req.url || '';
  const cleanPath = urlPath.replace(/^\/api/, '');

  // 1. Handle live pricing endpoint
  if (cleanPath.startsWith('/pricing/live') || cleanPath.startsWith('/v1/pricing/live')) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
    res.status(200).json({
      success: true,
      timestamp: Date.now(),
      auctions: pricingSnapshot.auctions || {},
      bazaar: pricingSnapshot.bazaar || {},
      totalLiveAuctions: Object.keys(pricingSnapshot.auctions || {}).length
    });
    return;
  }

  // 2. Handle CraftersMC Public API Proxy (protects CRAFTERS_API_KEY)
  const apiKey = process.env.CRAFTERS_API_KEY || '';
  try {
    const targetUrl = `${TARGET_API_BASE}${cleanPath}`;
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'CraftersMC-Accessory-Bag/1.0.0'
    };
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }

    const apiRes = await fetch(targetUrl, {
      method: req.method || 'GET',
      headers
    });

    const data = await apiRes.text();
    res.status(apiRes.status);
    res.setHeader('Content-Type', apiRes.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=180');
    res.end(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: 'Proxy request failed', message });
  }
}
