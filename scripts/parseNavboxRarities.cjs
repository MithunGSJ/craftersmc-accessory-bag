const fs = require('fs');

const html = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1088/content.md', 'utf8');

const navboxIdx = html.indexOf('class="ranger-navbox');
if (navboxIdx === -1) {
  console.log('No ranger-navbox found');
  process.exit(1);
}

const navboxHtml = html.slice(navboxIdx);

// Look for ranger-row with Icon_Common, Icon_Uncommon, Icon_Rare, Icon_Epic, Icon_Legendary, Icon_Mythic, Icon_Special
const rarityBlocks = navboxHtml.split('Icon_');
console.log('Rarity blocks:', rarityBlocks.length);

const itemsByRarity = {};

for (let i = 1; i < rarityBlocks.length; i++) {
  const block = rarityBlocks[i];
  const rarityNameMatch = block.match(/^([A-Za-z]+)\.png/);
  if (!rarityNameMatch) continue;
  const rarity = rarityNameMatch[1].toUpperCase();
  
  // Find all <a> inside this block until the next section
  const ulMatch = block.match(/<ul>([\s\S]*?)<\/ul>/);
  if (!ulMatch) continue;
  
  const lis = ulMatch[1].match(/<li[\s\S]*?<\/li>/gi) || [];
  const items = [];
  for (const li of lis) {
    const aMatch = li.match(/<a\s+href="\/wiki\/([^"#]+)"[^>]*title="([^"]+)"[^>]*>/);
    if (aMatch) {
      items.push({ name: aMatch[2], slug: aMatch[1] });
    }
  }
  itemsByRarity[rarity] = items;
}

console.log('Parsed rarities:');
let total = 0;
for (const [r, list] of Object.entries(itemsByRarity)) {
  console.log(`=== ${r} (${list.length}) ===`);
  list.forEach(item => console.log(`  - ${item.name} (/wiki/${item.slug})`));
  total += list.length;
}
console.log(`Total across all rarities: ${total}`);

fs.writeFileSync('scripts/craftersmc_navbox_by_rarity.json', JSON.stringify(itemsByRarity, null, 2));
