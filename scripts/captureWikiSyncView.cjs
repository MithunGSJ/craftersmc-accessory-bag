const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
  const screenshotPath = path.resolve('tmp/wiki_sync_view.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('📸 Screenshot saved to:', screenshotPath);

  await browser.close();
})();
