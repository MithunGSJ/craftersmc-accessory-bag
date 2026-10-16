const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/icons/accessories');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Load all 85 accessories from our registry modules
const files = ['Combat', 'Slayer', 'Gathering', 'Event', 'Automation', 'Special'];
const allItems = [];
for (const f of files) {
  const content = fs.readFileSync(path.join(__dirname, `../src/data/accessories${f}.ts`), 'utf8');
  const matches = [...content.matchAll(/id:\s*'([^']+)',\s*name:\s*'([^']+)'/g)];
  for (const m of matches) {
    allItems.push({ id: m[1], name: m[2] });
  }
}

console.log('Total accessories to find icons for:', allItems.length);

// Read wiki HTML from step 1041 & 1088 to extract exact icon paths
const html1041 = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md', 'utf8');
const html1088 = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1088/content.md', 'utf8');
const fullHtml = html1041 + '\n' + html1088;

function findWikiImgUrl(itemName) {
  // Normalize name
  // Match <img alt="Name.png" ... src="..."
  // Escape regex
  const escaped = itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '[ _]');
  const re = new RegExp(`<img[^>]+alt="(${escaped}[^"]*\\.png)"[^>]+src="([^"]+)"`, 'i');
  const m = fullHtml.match(re);
  if (m) {
    const filename = m[1].replace(/ /g, '_');
    return `https://craftersmc.wiki.gg/images/${filename}`;
  }
  // Try direct wiki image convention
  const directName = itemName.replace(/ /g, '_') + '.png';
  return `https://craftersmc.wiki.gg/images/${directName}`;
}

async function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://craftersmc.wiki.gg/'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function run() {
  let successCount = 0;
  for (const item of allItems) {
    const filename = `${item.id.toLowerCase()}.png`;
    const dest = path.join(targetDir, filename);
    const url = findWikiImgUrl(item.name);
    
    // Check if already downloaded
    if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
      successCount++;
      continue;
    }

    const ok = await downloadImage(url, dest);
    if (ok && fs.statSync(dest).size > 500) {
      console.log(`✅ [${item.name}] -> ${filename}`);
      successCount++;
    } else {
      // Try fallback URL format
      const fallbackUrl = `https://craftersmc.wiki.gg/images/${item.name.replace(/ /g, '_')}.png`;
      const ok2 = await downloadImage(fallbackUrl, dest);
      if (ok2 && fs.statSync(dest).size > 500) {
        console.log(`✅ [${item.name}] (fallback) -> ${filename}`);
        successCount++;
      } else {
        console.log(`❌ Failed to download icon for [${item.name}] from ${url}`);
      }
    }
  }
  console.log(`Downloaded ${successCount} / ${allItems.length} icons!`);
}

run();
