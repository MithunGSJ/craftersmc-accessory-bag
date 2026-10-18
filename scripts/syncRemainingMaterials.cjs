const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = '44858bff-1259-457f-905d-514867e3780d';
const SNAPSHOT_PATH = path.resolve(__dirname, '../src/data/pricingSnapshot.json');

const REMAINING_ITEMS = [
  'feather',
  'fermento',
  'fire_fragment',
  'fused_remnants',
  'glacial_fang',
  'gold_ingot',
  'golden_feather',
  'golden_tooth',
  'green_candy',
  'grizzly_bait',
  'mite_gel',
  'oak_leaves',
  'obsidian',
  'poisonous_potato',
  'purple_candy',
  'red_claw_egg',
  'redstone',
  'revenant_flesh',
  'revenant_viscera',
  'scythe_blade',
  'spooky_fragment',
  'squash',
  'sugar_cane',
  'super_compactor_3000',
  'tessellated_ender_pearl',
  'weak_wolf_catalyst',
  'wheat',
  'wheat_seeds',
  'wolf_tooth'
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchBazaarItem(itemId) {
  return new Promise(resolve => {
    https.get({
      hostname: 'api.craftersmc.net',
      path: `/v1/skyblock/bazaar/${itemId}/details`,
      headers: {
        'X-API-Key': API_KEY,
        'User-Agent': 'CraftersMC-Auditor/1.0'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', err => resolve({ status: 500, error: err.message }));
  });
}

(async () => {
  console.log(`Pacing ${REMAINING_ITEMS.length} items at 2.6s interval (~23 req/min) to avoid rate limits...`);
  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));

  for (let i = 0; i < REMAINING_ITEMS.length; i++) {
    const item = REMAINING_ITEMS[i];
    await sleep(2600); // 2.6 seconds

    let res = await fetchBazaarItem(item);
    if (res.status === 429) {
      console.log(`Rate limit on ${item}. Sleeping 20s...`);
      await sleep(20000);
      res = await fetchBazaarItem(item);
    }

    if (res.status === 200 && res.data && res.data.success) {
      const d = res.data;
      const weekly = Number(d.weeklyAveragePrice) || 0;
      const buyTop = Number(d.buyTopEntries?.[0]?.price) || 0;
      const sellTop = Number(d.sellTopEntries?.[0]?.price) || 0;
      const effective = Math.round(weekly || buyTop || sellTop);

      const old = snapshot.bazaar[item]?.avgPrice || 0;
      snapshot.bazaar[item] = {
        avgPrice: effective,
        weeklyAveragePrice: weekly || effective,
        buyVolume: d.buyVolume || 0,
        sellVolume: d.sellVolume || 0
      };
      console.log(`[${i + 1}/${REMAINING_ITEMS.length}] ✅ BAZAAR ${item}: ${old.toLocaleString()} -> ${effective.toLocaleString()} coins`);
    } else {
      const upper = item.toUpperCase();
      const ahItem = snapshot.auctions[upper];
      if (ahItem && ahItem.avgPrice > 0) {
        const old = snapshot.bazaar[item]?.avgPrice || 0;
        snapshot.bazaar[item] = {
          avgPrice: ahItem.avgPrice,
          weeklyAveragePrice: ahItem.avgPrice
        };
        console.log(`[${i + 1}/${REMAINING_ITEMS.length}] 🏛️ AUCTION ${item}: ${old.toLocaleString()} -> ${ahItem.avgPrice.toLocaleString()} coins`);
      } else {
        const cur = snapshot.bazaar[item]?.avgPrice || 0;
        console.log(`[${i + 1}/${REMAINING_ITEMS.length}] 📦 NON-BZ ${item}: keeping ${cur.toLocaleString()} coins (HTTP ${res.status})`);
      }
    }
  }

  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
  console.log('🎉 All remaining materials updated in snapshot!');
})();
