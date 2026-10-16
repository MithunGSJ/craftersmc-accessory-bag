const fs = require('fs');
const html = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md', 'utf8');
const m = html.match(/<img[^>]+alt="Zombie[^"]+"[^>]+>/g);
console.log(m);
