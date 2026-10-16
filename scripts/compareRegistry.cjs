const fs = require('fs');

const rarityData = JSON.parse(fs.readFileSync('scripts/craftersmc_navbox_by_rarity.json', 'utf8'));

// Flatten all non-special items from wiki
const wikiItems = [];
for (const [rarity, items] of Object.entries(rarityData)) {
  if (rarity === 'SPECIAL') continue;
  for (const it of items) {
    wikiItems.push({ name: it.name, slug: it.slug, rarity });
  }
}

console.log('Total non-special wiki accessories:', wikiItems.length);

// Read codebase items
const files = ['Combat', 'Slayer', 'Gathering', 'Event', 'Automation', 'Special'];
const codeItems = [];
for (const f of files) {
  const content = fs.readFileSync(`src/data/accessories${f}.ts`, 'utf8');
  const nameMatches = [...content.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1]);
  codeItems.push(...nameMatches);
}
console.log('Total codebase accessories:', codeItems.length);

// Compare
const codeSet = new Set(codeItems.map(n => n.toLowerCase().replace(/['"’]/g, '')));
const wikiSet = new Set(wikiItems.map(i => i.name.toLowerCase().replace(/['"’]/g, '')));

const missingInCode = wikiItems.filter(i => !codeSet.has(i.name.toLowerCase().replace(/['"’]/g, '')));
console.log('In Wiki but missing in code:', missingInCode.map(i => `${i.name} (${i.rarity})`));

const extraInCode = codeItems.filter(n => !wikiSet.has(n.toLowerCase().replace(/['"’]/g, '')));
console.log('In Code but missing in Wiki:', extraInCode);
