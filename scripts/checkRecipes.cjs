const fs = require('fs');

const filePath = process.env.WIKI_STEP_1041 || 'C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md';
if (!fs.existsSync(filePath)) {
  console.log(`[Script skipped] Cached file not found: ${filePath}`);
  process.exit(0);
}
const html1041 = fs.readFileSync(filePath, 'utf8');

// Look for recipe tables or crafting grids in the HTML
const recipes = [...html1041.matchAll(/Crafting[\s\S]*?<\/table>/gi)];
console.log('Crafting tables found in 1041:', recipes.length);

// Also let's check individual pages or search terms in 1041
const lines = html1041.split('\n');
const craftLines = lines.filter(l => l.includes('Crafting') || l.includes('recipe'));
console.log('Lines mentioning Crafting/recipe:', craftLines.length);
craftLines.slice(0, 20).forEach(l => console.log('  ', l.slice(0, 150)));
