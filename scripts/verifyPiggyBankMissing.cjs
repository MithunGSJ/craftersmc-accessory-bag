const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. On Fresh Profile: click Missing filter, search "Piggy"
  const missingFilterBtn = page.locator('button:has-text("Missing")').first();
  await missingFilterBtn.click();
  await page.waitForTimeout(300);

  const searchInput = page.locator('input[placeholder*="Search"]').first();
  await searchInput.fill('Piggy');
  await page.waitForTimeout(500);

  const freshPiggyCount = await page.locator('.accessory-card:has-text("Piggy Bank")').count();
  const freshBrokenCount = await page.locator('.accessory-card:has-text("Broken Piggy Bank")').count();
  const freshCrackedCount = await page.locator('.accessory-card:has-text("Cracked Piggy Bank")').count();

  console.log('Fresh Profile Missing Piggy Bank (should be 1):', freshPiggyCount);
  console.log('Fresh Profile Missing Broken Piggy Bank (should be 0):', freshBrokenCount);
  console.log('Fresh Profile Missing Cracked Piggy Bank (should be 0):', freshCrackedCount);

  // 2. Switch to Test Player (who owns Piggy Bank in slot 21)
  const lookupBtn = page.locator('button:has-text("Lookup Player")').first();
  await lookupBtn.click();
  await page.waitForTimeout(500);

  const testPlayerBtn = page.locator('button:has-text("Test Player")').first();
  await testPlayerBtn.click();
  await page.waitForTimeout(1200);

  // Ensure Missing filter is active
  await missingFilterBtn.click();
  await page.waitForTimeout(300);
  await searchInput.fill('Piggy');
  await page.waitForTimeout(500);

  const testMissingPiggyCount = await page.locator('.accessory-card:has-text("Piggy Bank")').count();
  const testMissingBrokenCount = await page.locator('.accessory-card:has-text("Broken Piggy Bank")').count();
  const testMissingCrackedCount = await page.locator('.accessory-card:has-text("Cracked Piggy Bank")').count();

  console.log('Owned Profile Missing Piggy Bank (should be 0):', testMissingPiggyCount);
  console.log('Owned Profile Missing Broken Piggy Bank (should be 0):', testMissingBrokenCount);
  console.log('Owned Profile Missing Cracked Piggy Bank (should be 0):', testMissingCrackedCount);

  // 3. Switch to All filter and verify Piggy Bank is OWNED (+5 MP), and Cracked/Broken are not polluting
  const allFilterBtn = page.locator('button:has-text("All")').first();
  await allFilterBtn.click();
  await page.waitForTimeout(300);

  const cardGridViewBtn = page.locator('button:has-text("Card Grid View")').first();
  await cardGridViewBtn.click();
  await page.waitForTimeout(500);

  const ownedPiggyCard = page.locator('.accessory-card:has-text("Piggy Bank")').first();
  const isPiggyOwned = await ownedPiggyCard.locator('text=Owned').count();
  console.log('Owned Profile Piggy Bank is OWNED (should be 1):', isPiggyOwned);

  const screenshotPath = path.resolve('tmp/piggy_bank_missing_verified.png');
  await page.screenshot({ path: screenshotPath });
  console.log('📸 Screenshot saved to:', screenshotPath);

  await browser.close();
})();
