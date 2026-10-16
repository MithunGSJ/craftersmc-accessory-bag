const https = require('https');

const API_KEY = '44858bff-1259-457f-905d-514867e3780d';

const testItems = ['bamboo', 'wheat', 'feather', 'enchanted_sugar_cane', 'enchanted_feather'];

async function testBazaarItem(itemId) {
  return new Promise((resolve) => {
    https.get({
      hostname: 'api.craftersmc.net',
      path: `/v1/skyblock/bazaar/${itemId}/details`,
      headers: {
        'X-API-Key': API_KEY,
        'User-Agent': 'CraftersMC-Auditor'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve({ itemId, status: res.statusCode, body: data });
      });
    }).on('error', e => resolve({ itemId, error: e.message }));
  });
}

async function run() {
  for (const it of testItems) {
    const res = await testBazaarItem(it);
    console.log(`Bazaar Item: ${it} -> Status: ${res.status}`);
    if (res.status === 200) {
      console.log(`  Data: ${res.body}`);
    } else {
      console.log(`  Body: ${res.body}`);
    }
  }
}

run();
