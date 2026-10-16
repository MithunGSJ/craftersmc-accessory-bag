const fs = require('fs');

const html = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md', 'utf8');

const idx = html.indexOf('Candy Artifact');
if (idx !== -1) {
  // Let's find the container around it
  const start = html.lastIndexOf('<div', idx);
  const end = html.indexOf('</div', idx + 2000);
  console.log('Snippet length:', end - start);
  console.log(html.slice(start, start + 3000));
} else {
  console.log('Not found');
}
