const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Type in search for 'Vaccine Talisman'
  const searchInput = page.locator('input[placeholder*="Search"]').first();
  await searchInput.fill('Vaccine Talisman');
  await page.waitForTimeout(500);

  // Click on the first card
  const card = page.locator('.accessory-card').first();
  await card.click();
  await page.waitForTimeout(1000);

  const modalPath = path.resolve('tmp/wiki_recipe_vaccine_modal.png');
  await page.screenshot({ path: modalPath });
  console.log('📸 Modal screenshot saved to:', modalPath);

  await browser.close();
})();
