const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/icons/accessories');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Load all 85 accessories
const files = ['Combat', 'Slayer', 'Gathering', 'Event', 'Automation', 'Special'];
const allItems = [];
for (const f of files) {
  const content = fs.readFileSync(path.join(__dirname, `../src/data/accessories${f}.ts`), 'utf8');
  const matches = [...content.matchAll(/id:\s*'([^']+)',\s*name:\s*'([^']+)'/g)];
  for (const m of matches) {
    allItems.push({ id: m[1], name: m[2] });
  }
}

async function run() {
  console.log('Launching browser to extract icons...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to CraftersMC Wiki Accessories page...');
  await page.goto('https://craftersmc.wiki.gg/wiki/Accessories', { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Wait for images to load
  await page.waitForTimeout(3000);

  // Extract all images with their alt text and base64 dataURL
  const imageDataList = await page.evaluate(() => {
    const results = [];
    const imgs = document.querySelectorAll('img');
    for (const img of imgs) {
      const alt = img.getAttribute('alt') || '';
      if (!alt.endsWith('.png') && !alt.endsWith('.PNG')) continue;
      
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 32;
        canvas.height = img.naturalHeight || 32;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        results.push({
          alt,
          src: img.src,
          dataUrl
        });
      } catch (e) {
        // Cross-origin tainted canvas
        results.push({
          alt,
          src: img.src,
          error: e.message
        });
      }
    }
    return results;
  });

  console.log('Extracted images count from page:', imageDataList.length);

  // If canvas was tainted, we can simply screenshot the element!
  let saved = 0;
  for (const item of allItems) {
    const filename = `${item.id.toLowerCase()}.png`;
    const dest = path.join(targetDir, filename);

    // Try finding element by title or alt
    const clean = item.name.replace(/'/g, "\\'");
    // Find the link or img for this item
    const imgEl = await page.$(`img[alt*="${item.name}"]`) ||
                  await page.$(`a[title="${clean}"] img`) ||
                  await page.$(`img[alt*="${item.name.replace(/ /g, '_')}"]`);

    if (imgEl) {
      await imgEl.screenshot({ path: dest });
      console.log(`✅ [${item.name}] -> ${filename}`);
      saved++;
    } else {
      console.log(`⚠️ Element not found for [${item.name}]`);
    }
  }

  console.log(`Successfully extracted ${saved} / ${allItems.length} icons!`);
  await browser.close();
}

run();
