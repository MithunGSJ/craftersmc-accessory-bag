const https = require('https');

const API_KEY = '44858bff-1259-457f-905d-514867e3780d';

const paths = [
  '/v1/skyblock/bazaar',
  '/v1/bazaar',
  '/v1/skyblock/auctions',
  '/v1/auctions',
  '/v1/skyblock/auction',
  '/v1/auction',
  '/v1/skyblock/items',
  '/v1/resources/skyblock/items',
  '/v1/skyblock/recipes',
  '/v1'
];

async function checkPath(p) {
  return new Promise((resolve) => {
    const opts = {
      hostname: 'api.craftersmc.net',
      path: p,
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
        'User-Agent': 'CraftersMC-Auditor'
      }
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path: p,
          statusCode: res.statusCode,
          snippet: data.slice(0, 300)
        });
      });
    });
    req.on('error', (e) => {
      resolve({ path: p, error: e.message });
    });
    req.end();
  });
}

async function run() {
  for (const p of paths) {
    const res = await checkPath(p);
    console.log(`Path: ${p} -> Status: ${res.statusCode || 'ERR'}`);
    if (res.snippet) {
      console.log(`  Snippet: ${res.snippet}`);
    }
    if (res.error) {
      console.log(`  Error: ${res.error}`);
    }
  }
}

run();
