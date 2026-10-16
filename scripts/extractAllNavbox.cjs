const fs = require('fs');

const html = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md', 'utf8');

const idx = html.indexOf('Candy Artifact');
const ulStart = html.lastIndexOf('<ul', idx);
const ulEnd = html.indexOf('</ul>', idx);
const ulHtml = html.slice(ulStart, ulEnd + 5);

const lis = ulHtml.match(/<li[\s\S]*?<\/li>/gi) || [];

const allAcc = [];
for (const li of lis) {
  // extract all <a> tags inside li (since Piggy bank has multiple)
  const aMatches = [...li.matchAll(/<a\s+href="\/wiki\/([^"#]+)"[^>]*title="([^"]+)"[^>]*>/g)];
  if (aMatches.length > 0) {
    for (const m of aMatches) {
      allAcc.push({
        title: m[2],
        slug: m[1]
      });
    }
  } else {
    const text = li.replace(/<[^>]+>/g, '').trim();
    allAcc.push({ title: text, slug: text.replace(/\s+/g, '_') });
  }
}

console.log('Total accessories found in navbox:', allAcc.length);
allAcc.forEach((a, i) => console.log(`${i + 1}. ${a.title} -> /wiki/${a.slug}`));

fs.writeFileSync('scripts/craftersmc_navbox_accessories.json', JSON.stringify(allAcc, null, 2));
