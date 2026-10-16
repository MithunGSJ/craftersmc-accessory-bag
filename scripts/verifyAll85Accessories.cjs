const fs = require('fs');

const wikiData = JSON.parse(fs.readFileSync('scripts/craftersmc_wiki_all.json', 'utf8'));
const wikiByName = new Map();
for (const w of wikiData) {
  wikiByName.set(w.name.toLowerCase().trim(), w);
}

const files = ['Combat', 'Slayer', 'Gathering', 'Event', 'Automation', 'Special'];
const allCodeItems = [];

for (const f of files) {
  const code = fs.readFileSync(`src/data/accessories${f}.ts`, 'utf8');
  // parse objects
  const objRegex = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*baseRarity:\s*'([^']+)',\s*category:\s*'([^']+)',\s*familyId:\s*'([^']+)',\s*tier:\s*(\d+),\s*description:\s*'([^']*)',\s*source:\s*'([^']*)',/g;
  let m;
  while ((m = objRegex.exec(code)) !== null) {
    allCodeItems.push({
      file: f,
      id: m[1],
      name: m[2],
      baseRarity: m[3],
      category: m[4],
      familyId: m[5],
      tier: parseInt(m[6], 10),
      description: m[7],
      source: m[8]
    });
  }
}

console.log('Total extracted code items:', allCodeItems.length);

// Compare descriptions and sources against wiki
let mismatches = 0;
for (const item of allCodeItems) {
  const wiki = wikiByName.get(item.name.toLowerCase().trim());
  if (!wiki) {
    console.log(`[NO WIKI TABLE ENTRY] ${item.name}`);
    continue;
  }
  
  const descCleanCode = item.description.trim();
  const descCleanWiki = wiki.description.trim();
  
  const srcCleanCode = item.source.trim();
  const srcCleanWiki = wiki.obtaining.trim();

  const descDiff = descCleanCode !== descCleanWiki && descCleanWiki.length > 0;
  const srcDiff = srcCleanCode !== srcCleanWiki && srcCleanWiki.length > 0;

  if (descDiff || srcDiff) {
    mismatches++;
    console.log(`--- [${item.name}] (${item.file}) ---`);
    if (descDiff) {
      console.log(`  Desc (Code): "${descCleanCode}"`);
      console.log(`  Desc (Wiki): "${descCleanWiki}"`);
    }
    if (srcDiff) {
      console.log(`  Source (Code): "${srcCleanCode}"`);
      console.log(`  Source (Wiki): "${srcCleanWiki}"`);
    }
  }
}

console.log(`Total mismatches with wiki table: ${mismatches} / ${allCodeItems.length}`);
