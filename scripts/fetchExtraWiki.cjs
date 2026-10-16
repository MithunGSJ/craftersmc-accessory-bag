const https = require('https');
const fs = require('fs');

const slugs = [
  'Bat_Talisman',
  'Bat_Ring',
  'Bat_Artifact',
  'Bat_Person_Talisman',
  'Bat_Person_Ring',
  'Bat_Person_Artifact',
  'Candy_Talisman',
  'Candy_Ring',
  'Candy_Artifact',
  'Candy_Relic',
  'Intimidation_Talisman',
  'Intimidation_Ring',
  'Intimidation_Artifact',
  'Seal_of_the_Seas',
  'Campfire_Initiate_Badge',
  'Campfire_Adept_Badge',
  'Campfire_Cultist_Badge',
  'Campfire_Scion_Badge',
  'Campfire_God_Badge'
];

async function fetchPage(slug) {
  return new Promise((resolve) => {
    const url = `https://craftersmc.wiki.gg/wiki/${slug}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ slug, status: res.statusCode, html: data });
      });
    }).on('error', (err) => {
      resolve({ slug, status: 500, error: err.message });
    });
  });
}

async function run() {
  const results = {};
  for (const slug of slugs) {
    console.log(`Fetching ${slug}...`);
    const res = await fetchPage(slug);
    if (res.status === 200) {
      // Extract title, description, rarity, stats, obtaining
      const titleMatch = res.html.match(/<h1[^>]*id="firstHeading"[^>]*>([\s\S]*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : slug;
      
      // Look for druid/infobox or description text
      // Let's grab the first few paragraphs
      const bodyMatch = res.html.match(/<div class="mw-parser-output">([\s\S]*?)<\/div>/i);
      const text = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
      
      // Look for Rarity
      const rarityMatch = res.html.match(/Rarity[\s\S]*?(COMMON|UNCOMMON|RARE|EPIC|LEGENDARY|MYTHIC|SPECIAL)/i);
      const rarity = rarityMatch ? rarityMatch[1].toUpperCase() : 'UNKNOWN';

      results[slug] = {
        title,
        rarity,
        textSnippet: text.slice(0, 500)
      };
      console.log(`  -> ${title} (${rarity}): ${text.slice(0, 150)}...`);
    } else {
      console.log(`  -> Failed with status ${res.status}`);
    }
  }
  fs.writeFileSync('scripts/wiki_extra_details.json', JSON.stringify(results, null, 2));
}

run();
