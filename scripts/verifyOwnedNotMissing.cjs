const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Switch to Test Player (DarkKing0098994, who owns Pig's Foot, Sky's Badge, New Year's Cake Bag)
  const lookupBtn = page.locator('button:has-text("Lookup Player")').first();
  await lookupBtn.click();
  await page.waitForTimeout(500);

  const testPlayerBtn = page.locator('button:has-text("Test Player")').first();
  await testPlayerBtn.click();
  await page.waitForTimeout(1200);

  // Switch to Card Grid View
  const cardGridViewBtn = page.locator('button:has-text("Card Grid View")').first();
  await cardGridViewBtn.click();
  await page.waitForTimeout(500);

  // 1. Verify in Missing tab: Pig's Foot, Sky's Badge, New Year's Cake Bag must NOT appear!
  const missingFilterBtn = page.locator('button:has-text("Missing")').first();
  await missingFilterBtn.click();
  await page.waitForTimeout(300);

  const searchInput = page.locator('input[placeholder*="Search"]').first();

  await searchInput.fill("Pig's Foot");
  await page.waitForTimeout(400);
  const missingPigsFootCount = await page.locator('.accessory-card:has-text("Pig\'s Foot")').count();
  console.log("Missing Pig's Foot count (must be 0):", missingPigsFootCount);

  await searchInput.fill("Sky's Badge");
  await page.waitForTimeout(400);
  const missingSkysBadgeCount = await page.locator('.accessory-card:has-text("Sky\'s Badge")').count();
  console.log("Missing Sky's Badge count (must be 0):", missingSkysBadgeCount);

  await searchInput.fill("New Year's Cake Bag");
  await page.waitForTimeout(400);
  const missingCakeBagCount = await page.locator('.accessory-card:has-text("New Year\'s Cake Bag")').count();
  console.log("Missing New Year's Cake Bag count (must be 0):", missingCakeBagCount);

  // 2. Verify in Owned tab: all three must appear as Owned!
  const ownedFilterBtn = page.locator('button:has-text("Owned")').first();
  await ownedFilterBtn.click();
  await page.waitForTimeout(300);

  await searchInput.fill("Pig's Foot");
  await page.waitForTimeout(400);
  const ownedPigsFoot = await page.locator('.accessory-card:has-text("Pig\'s Foot")').first().locator('text=Owned').count();
  console.log("Owned Pig's Foot card found (must be 1):", ownedPigsFoot);

  await searchInput.fill("Sky's Badge");
  await page.waitForTimeout(400);
  const ownedSkysBadge = await page.locator('.accessory-card:has-text("Sky\'s Badge")').first().locator('text=Owned').count();
  console.log("Owned Sky's Badge card found (must be 1):", ownedSkysBadge);

  await searchInput.fill("New Year's Cake Bag");
  await page.waitForTimeout(400);
  const ownedCakeBag = await page.locator('.accessory-card:has-text("New Year\'s Cake Bag")').first().locator('text=Owned').count();
  console.log("Owned New Year's Cake Bag card found (must be 1):", ownedCakeBag);

  // Clear search and take screenshot of Owned view
  await searchInput.fill("");
  await page.waitForTimeout(400);
  const screenshotPath = path.resolve('tmp/owned_not_missing_verified.png');
  await page.screenshot({ path: screenshotPath });
  console.log('📸 Screenshot saved to:', screenshotPath);

  await browser.close();
})();
