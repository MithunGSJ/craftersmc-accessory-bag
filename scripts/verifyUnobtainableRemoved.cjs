const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check search for 'Acacia'
  const searchInput = page.locator('input[placeholder*="Search"]').first();
  await searchInput.fill('Acacia');
  await page.waitForTimeout(500);

  const acaciaCards = await page.locator('.accessory-card').count();
  console.log('Acacia cards found (should be 0):', acaciaCards);

  // Check search for 'Beta Fish'
  await searchInput.fill('Beta Fish');
  await page.waitForTimeout(500);
  const betaCards = await page.locator('.accessory-card').count();
  console.log('Beta Fish cards found (should be 0):', betaCards);

  // Check search for 'Filthy Rich'
  await searchInput.fill('Filthy Rich');
  await page.waitForTimeout(500);
  const filthyCards = await page.locator('.accessory-card').count();
  console.log('Filthy Rich cards found (should be 0):', filthyCards);

  // Check search for 'Mini Fairy'
  await searchInput.fill('Mini Fairy');
  await page.waitForTimeout(500);
  const fairyCards = await page.locator('.accessory-card').count();
  console.log('Mini Fairy cards found (should be 0):', fairyCards);

  // Clear search and capture main overview
  await searchInput.fill('');
  await page.waitForTimeout(500);
  const screenshotPath = path.resolve('tmp/obtainable_catalog_clean.png');
  await page.screenshot({ path: screenshotPath });
  console.log('📸 Clean catalog screenshot saved to:', screenshotPath);

  await browser.close();
})();
