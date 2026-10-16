const fs = require('fs');
const html = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/649/content.md', 'utf8');

const tableMatch = html.match(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>([\s\S]*?)<\/table>/i);
if (!tableMatch) {
  console.log('No wikitable found');
  process.exit(1);
}

const rows = tableMatch[1].match(/<tr[\s\S]*?<\/tr>/gi) || [];
console.log('Total table rows:', rows.length);

const parsed = [];
for (const r of rows) {
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
    parsed.push({
      name: tds[0],
      rarity: tds[1],
      description: tds[2],
      obtaining: tds[3] || ''
    });
  }
}

console.log('Parsed accessories count:', parsed.length);
fs.writeFileSync('scripts/craftersmc_wiki_all.json', JSON.stringify(parsed, null, 2));

// Filter out Admin, Removed, Special, Unobtainable
const valid = parsed.filter(item => {
  const name = item.name;
  if (['Acacia Stop', 'Beta Fish', 'Filthy Rich Talisman', 'Mini Fairy', 'Creative Mind', 'Game Breaker', 'Magical Encyclopedia', 'Broken Piggy Bank', 'Cracked Piggy Bank'].includes(name)) {
    return false;
  }
  if (item.obtaining.includes('Admin') || item.obtaining.includes('Removed') || item.obtaining.includes('Unobtainable')) {
    return false;
  }
  return true;
});

console.log('Valid CraftersMC accessories:', valid.length);
valid.forEach((v, idx) => {
  console.log(`${idx + 1}. [${v.name}] | Obtaining: [${v.obtaining}] | Desc: [${v.description}]`);
});
