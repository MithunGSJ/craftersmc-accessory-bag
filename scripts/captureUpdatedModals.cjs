const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to app on http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 1. Check Draconic Artifact
  const searchInput = page.locator('input[type="text"], input[placeholder*="Search"]').first();
  await searchInput.fill('Draconic');
  await page.waitForTimeout(400);

  const draconicItem = page.locator('text=Draconic Artifact').first();
  await draconicItem.click();
  await page.waitForSelector('.modal-content');
  console.log('Opened Draconic Artifact modal');

  if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
  await page.screenshot({ path: 'tmp/draconic_artifact_updated.png' });

  // Close modal
  await page.locator('.modal-close-btn').click();
  await page.waitForTimeout(300);

  // 2. Check Bat Person Artifact
  await searchInput.fill('Bat Person');
  await page.waitForTimeout(400);

  const batItem = page.locator('text=Bat Person Artifact').first();
  await batItem.click();
  await page.waitForSelector('.modal-content');
  console.log('Opened Bat Person Artifact modal');

  await page.screenshot({ path: 'tmp/bat_person_artifact_updated.png' });

  await browser.close();
  console.log('Screenshots captured successfully!');
})();
