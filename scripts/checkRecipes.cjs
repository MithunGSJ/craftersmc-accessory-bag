const fs = require('fs');

// Check the HTML files saved in steps 1041 and 1088
const html1041 = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md', 'utf8');

// Look for recipe tables or crafting grids in the HTML
const recipes = [...html1041.matchAll(/Crafting[\s\S]*?<\/table>/gi)];
console.log('Crafting tables found in 1041:', recipes.length);

// Also let's check individual pages or search terms in 1041
const lines = html1041.split('\n');
const craftLines = lines.filter(l => l.includes('Crafting') || l.includes('recipe'));
console.log('Lines mentioning Crafting/recipe:', craftLines.length);
craftLines.slice(0, 20).forEach(l => console.log('  ', l.slice(0, 150)));
