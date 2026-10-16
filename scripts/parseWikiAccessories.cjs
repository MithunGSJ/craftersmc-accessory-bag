const fs = require('fs');

const content = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/2407/content.md', 'utf8');

const tableStart = content.indexOf('<table class="wikitable zebra sortable">');
const tableEnd = content.indexOf('</table>', tableStart);
const tableHtml = content.slice(tableStart, tableEnd);

const rows = tableHtml.split('<tr>').slice(1);
const items = [];

let lastObtaining = '';

for (const row of rows) {
  const linkMatch = row.match(/<a href="\/wiki\/([^"]+)"[^>]*><span[^>]*class="mcfont">([^<]+)<\/span><\/a>/);
  if (!linkMatch) continue;
  const url = linkMatch[1];
  const name = linkMatch[2];
  
  const cells = row.split(/<td[^>]*>/).slice(1);
  // cells[0] is accessory name/icon
  // cells[1] is rarity
  // cells[2] is description
  // cells[3] is obtaining (if present, else uses lastObtaining if rowspan)
  const desc = (cells[2] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  let obtaining = (cells[3] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (obtaining) {
    lastObtaining = obtaining;
  } else {
    obtaining = lastObtaining;
  }
  items.push({ name, url, desc, obtaining });
}

console.log('Total accessories parsed:', items.length);
fs.writeFileSync('scripts/wikiAccessories.json', JSON.stringify(items, null, 2));
console.log('Craftable accessories:', items.filter(i => i.obtaining.toLowerCase().includes('crafting')).length);
