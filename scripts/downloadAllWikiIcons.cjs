const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/icons/accessories');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const html1041 = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md', 'utf8');

const imgTags = html1041.match(/<img[^>]+>/gi) || [];
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

// Load all 85 accessories
const files = ['Combat', 'Slayer', 'Gathering', 'Event', 'Automation', 'Special'];
const allItems = [];
for (const f of files) {
  const content = fs.readFileSync(path.join(__dirname, `../src/data/accessories${f}.ts`), 'utf8');
  const matches = [...content.matchAll(/id:\s*'([^']+)',\s*name:\s*'([^']+)'/g)];
  for (const match of matches) {
    allItems.push({ id: match[1], name: match[2] });
  }
}

async function download(url, dest) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://craftersmc.wiki.gg/wiki/Accessories'
      }
    }, (res) => {
      if (res.statusCode === 200) {
        const stream = fs.createWriteStream(dest);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function run() {
  let downloaded = 0;
  for (const it of allItems) {
    const key = it.name.toLowerCase().trim();
    const url = imageMap.get(key);
    const dest = path.join(targetDir, `${it.id.toLowerCase()}.png`);
    
    if (url) {
      const ok = await download(url, dest);
      if (ok && fs.statSync(dest).size > 50) {
        console.log(`✅ [${it.name}] (${it.id}) -> ${dest}`);
        downloaded++;
      } else {
        console.log(`❌ Failed download for [${it.name}] from ${url}`);
      }
    } else {
      console.log(`⚠️ No image found in wiki map for [${it.name}]`);
    }
  }
  console.log(`Successfully downloaded ${downloaded} / ${allItems.length} accessory icons!`);
}

run();
