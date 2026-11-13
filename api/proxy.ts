export const config = {
  runtime: 'edge'
};

const TARGET_API_BASE = 'https://api.craftersmc.net';

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  const url = new URL(request.url);
  // Support both direct route and rewritten route headers safely
  let rawPath =
    request.headers.get('x-forwarded-uri') ||
    request.headers.get('x-matched-path') ||
    url.pathname;

  // Separate any query params from rawPath to avoid duplicate query strings
  const queryIndex = rawPath.indexOf('?');
  const queryInRaw = queryIndex !== -1 ? rawPath.slice(queryIndex) : '';
  if (queryIndex !== -1) {
    rawPath = rawPath.slice(0, queryIndex);
  }

  // Strip leading /api/proxy or /api prefix cleanly
  let cleanPath = rawPath.replace(/^\/api(\/proxy)?(\/|$)/, '/');
  cleanPath = '/' + cleanPath.replace(/^\/+/, '');

  // Construct target URL and strictly validate origin to prevent SSRF
  const finalSearch = url.search || queryInRaw;
  let targetUrl: URL;
  try {
    targetUrl = new URL(cleanPath + finalSearch, TARGET_API_BASE);
    if (targetUrl.origin !== TARGET_API_BASE) {
      return new Response(JSON.stringify({ error: 'Forbidden target host' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Malformed target URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const apiKey = process.env.CRAFTERS_API_KEY || '';
  const headers = new Headers();
  headers.set('Accept', 'application/json');
  headers.set('User-Agent', 'CraftersMC-Accessory-Bag/1.0.0');
  if (apiKey) {
    headers.set('X-API-Key', apiKey);
  }

  const incomingContentType = request.headers.get('content-type');
  if (incomingContentType) {
    headers.set('Content-Type', incomingContentType);
  }

  try {
    const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
      signal: AbortSignal.timeout(15000)
    };

    if (hasBody && request.body) {
      fetchOptions.body = request.body;
      // @ts-ignore - Duplex mode is required by modern Edge/Node fetch for streaming request bodies
      fetchOptions.duplex = 'half';
    }

    const apiRes = await fetch(targetUrl.toString(), fetchOptions);

    const body = await apiRes.arrayBuffer();
    const cacheControl = apiRes.ok
      ? 's-maxage=60, stale-while-revalidate=180'
      : 'no-store, no-cache, must-revalidate';

    return new Response(body, {
      status: apiRes.status,
      headers: {
        'Content-Type': apiRes.headers.get('content-type') || 'application/json',
        'Cache-Control': cacheControl,
        ...corsHeaders
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: 'Proxy request failed', message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        ...corsHeaders
      }
    });
  }
}
