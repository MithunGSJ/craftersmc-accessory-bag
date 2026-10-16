const fs = require('fs');

const html = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md', 'utf8');

const imgTags = html.match(/<img[^>]+>/gi) || [];
console.log('Total img tags in HTML:', imgTags.length);

const imageMap = new Map();
for (const tag of imgTags) {
  const altMatch = tag.match(/alt="([^"]+)"/i);
  const srcMatch = tag.match(/src="([^"]+)"/i);
  const srcsetMatch = tag.match(/srcset="([^"]+)"/i);

  if (altMatch && altMatch[1].endsWith('.png')) {
    const alt = altMatch[1];
    let bestUrl = srcMatch ? srcMatch[1] : '';
    if (srcsetMatch) {
      const parts = srcsetMatch[1].split(',').map(s => s.trim().split(' '));
      const twoX = parts.find(p => p[1] === '2x');
      if (twoX) bestUrl = twoX[0];
      else if (parts.length > 0) bestUrl = parts[parts.length - 1][0];
    }
    const cleanKey = alt.replace(/\.png$/i, '').replace(/_/g, ' ').toLowerCase().trim();
    if (bestUrl && !imageMap.has(cleanKey)) {
      imageMap.set(cleanKey, `https://craftersmc.wiki.gg${bestUrl}`);
    }
  }
}

console.log('Successfully mapped items count:', imageMap.size);
for (const [k, v] of [...imageMap.entries()].slice(0, 10)) {
  console.log(`  ${k} -> ${v}`);
}
