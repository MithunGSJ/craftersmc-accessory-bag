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
  const cleanPath = url.pathname.replace(/^\/api/, '');
  const targetUrl = `${TARGET_API_BASE}${cleanPath}${url.search}`;

  const apiKey = process.env.CRAFTERS_API_KEY || '';
  const headers = new Headers();
  headers.set('Accept', 'application/json');
  headers.set('User-Agent', 'CraftersMC-Accessory-Bag/1.0.0');
  if (apiKey) {
    headers.set('X-API-Key', apiKey);
  }

  try {
    const apiRes = await fetch(targetUrl, {
      method: request.method,
      headers
    });

    const body = await apiRes.arrayBuffer();
    return new Response(body, {
      status: apiRes.status,
      headers: {
        'Content-Type': apiRes.headers.get('content-type') || 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=180',
        ...corsHeaders
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: 'Proxy request failed', message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
