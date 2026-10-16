const https = require('https');

const API_KEY = '44858bff-1259-457f-905d-514867e3780d';

const paths = [
  '/v1/skyblock/bazaar/bamboo',
  '/v1/resources/skyblock/bazaar/bamboo',
  '/v1/skyblock/bazaar/product?itemId=bamboo',
  '/v1/skyblock/bazaar/item/bamboo',
  '/v1/skyblock/bazaar?itemId=bamboo',
  '/v1/resources/skyblock/bazaar/item/bamboo',
  '/v1/resources/bazaar',
  '/v1/skyblock/bazaar/all',
  '/v1/skyblock/bazaar/data'
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
        resolve({ path: p, status: res.statusCode, body: data.slice(0, 300) });
      });
    }).on('error', e => resolve({ path: p, error: e.message }));
  });
}

async function run() {
  for (const p of paths) {
    const r = await check(p);
    console.log(`${r.path} -> ${r.status}`);
    if (r.status === 200 || r.status === 302) {
      console.log('   DATA:', r.body);
    }
  }
}

run();
