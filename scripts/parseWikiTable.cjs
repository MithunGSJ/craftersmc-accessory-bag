const fs = require('fs');

const html = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md', 'utf8');
const tableMatch = html.match(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>([\s\S]*?)<\/table>/i);

if (!tableMatch) {
  console.log('No wikitable found');
  process.exit(1);
}

const rows = tableMatch[1].match(/<tr[\s\S]*?<\/tr>/gi) || [];
console.log('Total table rows:', rows.length);

const items = [];
for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  const ths = (r.match(/<th[\s\S]*?<\/th>/gi) || []).map(th => th.replace(/<[^>]+>/g, '').trim());
  if (ths.length > 0) {
    console.log('Header row:', ths);
    continue;
  }
  const tds = (r.match(/<td[\s\S]*?<\/td>/gi) || []).map(td => {
    return td.replace(/<br\s*\/?>/gi, ' ')
             .replace(/<[^>]+>/g, '')
             .replace(/&nbsp;/g, ' ')
             .replace(/&#039;/g, "'")
             .replace(/&quot;/g, '"')
             .replace(/&amp;/g, '&')
             .replace(/\s+/g, ' ')
             .trim();
  });
  if (tds.length >= 3) {
    items.push({
      name: tds[0],
      rarity: tds[1],
      description: tds[2],
      obtaining: tds[3] || ''
    });
  }
}

console.log('Total items in table:', items.length);
fs.writeFileSync('scripts/craftersmc_wiki_all.json', JSON.stringify(items, null, 2));

// Print all items with their fields
items.forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.name}] | Rarity: [${item.rarity}] | Obtaining: [${item.obtaining}]`);
  console.log(`   Desc: ${item.description}`);
});
