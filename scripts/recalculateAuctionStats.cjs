const fs = require('fs');
const https = require('https');
const API_KEY = '44858bff-1259-457f-905d-514867e3780d';

function fetchPage(p) {
  return new Promise((resolve) => {
    const req = https.get({
      hostname: 'api.craftersmc.net',
      path: '/v1/skyblock/auctions?page=' + p,
      headers: { 'X-API-Key': API_KEY, 'User-Agent': 'CraftersMC-Auditor' }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve({ auctions: [] }); }
      });
    });
    req.on('error', () => resolve({ auctions: [] }));
  });
}

(async () => {
  let all = [];
  const p0 = await fetchPage(0);
  if (p0.auctions) all = all.concat(p0.auctions);
  const p1 = await fetchPage(1);
  if (p1.auctions) all = all.concat(p1.auctions);
  console.log('Total auctions fetched:', all.length);

  const byItem = {};
  for (const a of all) {
    const rawId = (a.itemId || a.item?.id || '').replace(/^trpixel:/i, '').toUpperCase();
    if (!byItem[rawId]) byItem[rawId] = [];
    byItem[rawId].push(a);
  }

  const cleanedStats = {};
  for (const [id, list] of Object.entries(byItem)) {
    const binList = list.filter(a => a.type === 'BIN').map(a => a.startingPrice).sort((a, b) => a - b);

    if (binList.length > 0) {
      const min = binList[0];
      // Filter out crazy troll outliers (> 3x the lowest or > 2.5x median)
      const median = binList[Math.floor(binList.length / 2)];
      const filtered = binList.filter(p => p <= Math.max(median * 2.5, min * 3));
      const avg = Math.round(filtered.reduce((s, p) => s + p, 0) / filtered.length);
      const max = filtered[filtered.length - 1];
      cleanedStats[id] = {
        minPrice: min,
        avgPrice: avg,
        maxPrice: max,
        count: binList.length,
        totalCount: list.length,
        hasBin: true
      };
    } else {
      // Normal auctions only: check highest bids
      const bidList = list.filter(a => a.highestBidAmount > 0).map(a => a.highestBidAmount).sort((a, b) => a - b);
      if (bidList.length > 0) {
        cleanedStats[id] = {
          minPrice: bidList[0],
          avgPrice: Math.round(bidList.reduce((s, p) => s + p, 0) / bidList.length),
          maxPrice: bidList[bidList.length - 1],
          count: bidList.length,
          totalCount: list.length,
          hasBin: false
        };
      } else {
        const startList = list.map(a => a.startingPrice).sort((a, b) => a - b);
        cleanedStats[id] = {
          minPrice: startList[0],
          avgPrice: Math.round(startList.reduce((s, p) => s + p, 0) / startList.length),
          maxPrice: startList[startList.length - 1],
          count: startList.length,
          totalCount: list.length,
          hasBin: false
        };
      }
    }
  }

  fs.writeFileSync('scripts/craftersmc_clean_auction_stats.json', JSON.stringify(cleanedStats, null, 2));
  console.log('Saved clean auction stats for', Object.keys(cleanedStats).length, 'items');

  ['EXPERIENCE_ARTIFACT', 'BAT_TALISMAN', 'BAT_PERSON_TALISMAN', 'BLOOD_GOD_CREST', 'FEATHER_ARTIFACT', 'GOLDEN_FEATHER_BOOTS', 'SPEED_ARTIFACT'].forEach(id => {
    console.log(id, '-->', cleanedStats[id]);
  });
})();
