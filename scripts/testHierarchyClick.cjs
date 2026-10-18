const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // Search for Bat Person to find it easily
  const searchInput = page.locator('input[type="text"], input[placeholder*="Search"]').first();
  await searchInput.fill('Bat Person');
  await page.waitForTimeout(400);

  // Click on the Bat Person Ring card or slot
  const ringItem = page.locator('text=Bat Person Ring').first();
  await ringItem.click();
  await page.waitForSelector('.modal-content');
  console.log('Opened Bat Person Ring modal');

  // Verify modal header has Bat Person Ring
  const modalHeader = page.locator('.modal-content h2').first();
  console.log('Current modal header:', await modalHeader.textContent());

  if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');

  await page.screenshot({ path: 'tmp/hierarchy_step1_ring.png' });

  // Click on T1: Bat Person Talisman
  const t1Btn = page.locator('button.hierarchy-chip:has-text("Bat Person Talisman")').first();
  console.log('Clicking T1: Bat Person Talisman chip...');
  await t1Btn.click();
  await page.waitForTimeout(300);

  const t1Header = await modalHeader.textContent();
  console.log('Modal header after clicking T1:', t1Header);
  await page.screenshot({ path: 'tmp/hierarchy_step2_talisman.png' });

  // Click on T3: Bat Person Artifact
  const t3Btn = page.locator('button.hierarchy-chip:has-text("Bat Person Artifact")').first();
  console.log('Clicking T3: Bat Person Artifact chip...');
  await t3Btn.click();
  await page.waitForTimeout(300);

  const t3Header = await modalHeader.textContent();
  console.log('Modal header after clicking T3:', t3Header);
  await page.screenshot({ path: 'tmp/hierarchy_step3_artifact.png' });

  // Close modal
  await page.locator('.modal-close-btn').click();
  await page.waitForTimeout(200);

  // Now test Speed family as well
  await searchInput.fill('Speed');
  await page.waitForTimeout(400);

  const speedRing = page.locator('text=Speed Ring').first();
  await speedRing.click();
  await page.waitForSelector('.modal-content');
  console.log('Opened Speed Ring modal');
  console.log('Modal header:', await modalHeader.textContent());

  const speedT1 = page.locator('button.hierarchy-chip:has-text("Speed Talisman")').first();
  await speedT1.click();
  await page.waitForTimeout(300);
  console.log('Modal header after clicking T1 Speed Talisman:', await modalHeader.textContent());
  await page.screenshot({ path: 'tmp/hierarchy_speed_talisman.png' });

  await browser.close();

  const success = t1Header.includes('Bat Person Talisman') && t3Header.includes('Bat Person Artifact');
  console.log('Verification Success:', success);

  fs.writeFileSync('tmp/hierarchy_test_result.json', JSON.stringify({
    success,
    initial: 'Bat Person Ring',
    t1Navigated: t1Header,
    t3Navigated: t3Header,
    timestamp: new Date().toISOString()
  }, null, 2));

  if (!success) process.exit(1);
})();
