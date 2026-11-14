const fs = require('fs');
const filePath = process.env.WIKI_STEP_1041 || 'C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md';
if (!fs.existsSync(filePath)) {
  console.log(`[Script skipped] Cached file not found: ${filePath}`);
  process.exit(0);
}
const html = fs.readFileSync(filePath, 'utf8');
const m = html.match(/<img[^>]+alt="Zombie[^"]+"[^>]+>/g);
console.log(m);
