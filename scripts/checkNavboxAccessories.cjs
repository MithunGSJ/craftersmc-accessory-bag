const fs = require('fs');

const html = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md', 'utf8');

const idx = html.indexOf('Candy Artifact');
if (idx !== -1) {
  // Find the <ul> or <div> enclosing Candy Artifact
  const ulStart = html.lastIndexOf('<ul', idx);
  const ulEnd = html.indexOf('</ul>', idx);
  console.log('UL range:', ulStart, ulEnd);
  const ulHtml = html.slice(ulStart, ulEnd + 5);
  const lis = ulHtml.match(/<li[\s\S]*?<\/li>/gi) || [];
  console.log('Count of items in this accessories list:', lis.length);
  lis.forEach((li, i) => {
    const text = li.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`${i + 1}. ${text}`);
  });
}
