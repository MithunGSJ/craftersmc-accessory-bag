const fs = require('fs');

const html = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md', 'utf8');

const rangerIdx = html.indexOf('class="ranger-list"');
if (rangerIdx === -1) {
  console.log('No ranger-list found');
  process.exit(1);
}

// Extract up to the next closing div of ranger-list
const closeDiv = html.indexOf('</div>', rangerIdx);
// Note: ranger-list might contain nested divs or just <ul><li>...
const listHtml = html.slice(rangerIdx, rangerIdx + 60000);

const lis = listHtml.match(/<li[\s\S]*?<\/li>/gi) || [];
console.log('Found lis in ranger-list:', lis.length);

const items = [];
for (const li of lis) {
  const nameMatch = li.match(/title="([^"]+)"/);
  const hrefMatch = li.match(/href="\/wiki\/([^"]+)"/);
  if (nameMatch) {
    items.push({
      title: nameMatch[1],
      wikiSlug: hrefMatch ? hrefMatch[1] : ''
    });
  }
}

console.log('Extracted items count:', items.length);
items.forEach((it, idx) => {
  console.log(`${idx + 1}. ${it.title} (${it.wikiSlug})`);
});
