import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  if (!fs.existsSync('evidence')) {
    fs.mkdirSync('evidence', { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // 1. Search for "Personal Deletor"
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('Personal Deletor');
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(600);

    await page.screenshot({
      path: 'evidence/FIX-001-personal-deletor-no-lower-tiers.png',
      fullPage: false
    });

    // 2. Search for "freezer"
    await searchInput.fill('freezer');
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(600);

    await page.screenshot({
      path: 'evidence/FIX-002-dayfreezer-nightfreezer-gems.png',
      fullPage: false
    });

    // 3. Search for "Sky's Badge"
    await searchInput.fill("Sky's Badge");
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(600);

    await page.screenshot({
      path: 'evidence/FIX-003-skys-badge-icon-and-price.png',
      fullPage: false
    });

    // 4. Search for "Cake Bag"
    await searchInput.fill('Cake Bag');
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(600);

    await page.screenshot({
      path: 'evidence/FIX-004-cake-bag-icon-and-price.png',
      fullPage: false
    });

    console.log('Successfully captured all verification evidence screenshots!');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
