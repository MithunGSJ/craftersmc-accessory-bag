const https = require('https');
const fs = require('fs');
const path = require('path');

// Ensure directory exists
const dir = path.join(__dirname, '../public/icons/accessories');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Read the wiki HTML content where all image URLs were saved in step 1041 or 1088
const html = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1088/content.md', 'utf8');

// Find all <img alt="XYZ.png" src="..." in the HTML
const imgMatches = [...html.matchAll(/<img[^>]+alt="([^"]+\.png)"[^>]+src="([^"]+)"/g)];
console.log('Total img matches found in wiki HTML:', imgMatches.length);

const imageMap = new Map();
for (const m of imgMatches) {
  const alt = m[1]; // e.g. "Feather_Artifact.png" or "Feather Artifact.png"
  const src = m[2]; // e.g. "/images/thumb/Feather_Artifact.png/14px-Feather_Artifact.png?d58a68"
  // Normalize alt
  const cleanName = alt.replace(/\.png$/i, '').replace(/_/g, ' ').toLowerCase().trim();
  if (!imageMap.has(cleanName)) {
    // If it's a thumb, we can also extract the full image path:
    // e.g. /images/thumb/Feather_Artifact.png/14px-... -> /images/Feather_Artifact.png
    const fullMatch = src.match(/\/images\/thumb\/([^\/]+)\//);
    const fullUrl = fullMatch ? `https://craftersmc.wiki.gg/images/${fullMatch[1]}` : `https://craftersmc.wiki.gg${src}`;
    imageMap.set(cleanName, fullUrl);
  }
}

console.log('Unique images mapped:', imageMap.size);
for (const [k, v] of [...imageMap.entries()].slice(0, 15)) {
  console.log(`  ${k} -> ${v}`);
}
