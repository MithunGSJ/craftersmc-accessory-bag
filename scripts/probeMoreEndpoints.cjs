const https = require('https');

const API_KEY = '44858bff-1259-457f-905d-514867e3780d';

const paths = [
  '/v1/skyblock/bazaar',
  '/v1/skyblock/bazaar/',
  '/v1/skyblock/bz',
  '/v1/skyblock/bazaar/products',
  '/v1/bazaar/products',
  '/v1/skyblock/bazaar/items',
  '/v1/skyblock/market',
  '/v1/market',
  '/v1/bazaar/summary',
  '/v1/skyblock/auctions/ended',
  '/v1/skyblock/auctions?page=0',
  '/v1/skyblock/auctions?page=1'
];

async function check(p) {
  return new Promise((resolve) => {
    https.get({
      hostname: 'api.craftersmc.net',
      path: p,
      headers: { 'X-API-Key': API_KEY, 'User-Agent': 'CraftersMC-Auditor' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve({ path: p, status: res.statusCode, body: data.slice(0, 200) });
      });
    }).on('error', e => resolve({ path: p, error: e.message }));
  });
}

async function run() {
  for (const p of paths) {
    const r = await check(p);
    console.log(`${r.path} -> ${r.status}`);
    if (r.status === 200) {
      console.log('   DATA:', r.body);
    }
  }
}

run();
