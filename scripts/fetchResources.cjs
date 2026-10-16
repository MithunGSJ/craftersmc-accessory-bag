const https = require('https');

const API_KEY = '44858bff-1259-457f-905d-514867e3780d';

const paths = [
  '/v1/resources/skyblock/bazaar/items',
  '/v1/resources/skyblock/bazaar',
  '/v1/resources/skyblock/items',
  '/v1/resources/skyblock/recipes'
];

async function fetchPath(p) {
  return new Promise((resolve) => {
    https.get({
      hostname: 'api.craftersmc.net',
      path: p,
      headers: { 'X-API-Key': API_KEY, 'User-Agent': 'CraftersMC-Auditor' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve({ path: p, status: res.statusCode, body: data });
      });
    }).on('error', e => resolve({ path: p, error: e.message }));
  });
}

async function run() {
  for (const p of paths) {
    const r = await fetchPath(p);
    console.log(`Path: ${r.path} -> Status: ${r.status}`);
    if (r.status === 200) {
      console.log(`  Data Length: ${r.body.length}`);
      console.log(`  Snippet: ${r.body.slice(0, 300)}`);
      // Save sample file
      const filename = p.replace(/[^a-zA-Z0-9]/g, '_') + '.json';
      require('fs').writeFileSync('scripts/' + filename, r.body);
    }
  }
}

run();
