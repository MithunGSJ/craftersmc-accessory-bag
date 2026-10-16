const { chromium } = require('playwright');

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Select "Fresh Profile" (button.pill-btn) where player owns no accessories
  console.log('Selecting Fresh Profile...');
  const freshProfileBtn = await page.locator('button.pill-btn:has-text("Fresh Profile")');
  await freshProfileBtn.click();
  await page.waitForTimeout(500);

  // Search for Fire Extinguisher
  console.log('Searching for Fire Extinguisher...');
  const searchInput = await page.locator('input.search-input');
  await searchInput.fill('Fire Extinguisher');
  await page.waitForTimeout(400);

  const extinguisherCard = await page.locator('.accessory-card:has-text("Fire Extinguisher")').first();
  await extinguisherCard.click();
  await page.waitForSelector('.modal-content');
  await page.waitForTimeout(400);

  await page.screenshot({
    path: 'evidence/modal-fire-extinguisher.png',
    fullPage: false
  });
  console.log('Saved evidence/modal-fire-extinguisher.png');

  await browser.close();
  console.log('Done!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
