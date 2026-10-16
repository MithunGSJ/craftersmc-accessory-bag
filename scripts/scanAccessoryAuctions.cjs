const https = require('https');

const API_KEY = '44858bff-1259-457f-905d-514867e3780d';

async function fetchPage(p) {
  return new Promise((resolve) => {
    https.get({
      hostname: 'api.craftersmc.net',
      path: `/v1/skyblock/auctions?page=${p}`,
      headers: {
        'X-API-Key': API_KEY,
        'User-Agent': 'CraftersMC-Auditor'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', e => resolve({ error: e.message }));
  });
}

async function run() {
  const p0 = await fetchPage(0);
  const p1 = await fetchPage(1);
  const all = [...(p0.auctions || []), ...(p1.auctions || [])];
  console.log('Total auctions fetched:', all.length);

  const accAuctions = all.filter(a => a.category === 'ACCESSORIES' || a.itemId?.toLowerCase().includes('talisman') || a.itemId?.toLowerCase().includes('ring') || a.itemId?.toLowerCase().includes('artifact') || a.itemId?.toLowerCase().includes('relic') || a.itemId?.toLowerCase().includes('badge') || a.itemId?.toLowerCase().includes('orb'));

  console.log('Accessory auctions count:', accAuctions.length);

  const byItem = {};
  for (const a of accAuctions) {
    const key = a.itemId;
    const price = a.type === 'BIN' ? a.startingPrice : (a.highestBidAmount > 0 ? a.highestBidAmount : a.startingPrice);
    if (!byItem[key]) {
      byItem[key] = [];
    }
    byItem[key].push(price);
  }

  for (const [item, prices] of Object.entries(byItem)) {
    prices.sort((a, b) => a - b);
    const min = prices[0];
    const max = prices[prices.length - 1];
    const avg = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
    console.log(`[${item}] Count: ${prices.length} | Min: ${min.toLocaleString()} | Max: ${max.toLocaleString()} | Avg: ${avg.toLocaleString()}`);
  }
}

run();
