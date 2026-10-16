const { chromium } = require('playwright');
const fs = require('fs');

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  if (!fs.existsSync('evidence')) fs.mkdirSync('evidence');

  // 1. Verify and capture default Minecraft Inventory View
  console.log('Capturing default Minecraft Inventory View (FEAT-014)...');
  await page.waitForSelector('.mc-gui-container');

  // Hover over one of the slots (e.g., first slot with an item)
  const occupiedSlots = await page.$$('.mc-slot.occupied');
  if (occupiedSlots.length > 0) {
    await occupiedSlots[0].hover();
    await page.waitForTimeout(500); // Wait for tooltip to position
  }

  await page.screenshot({
    path: 'evidence/FEAT-014-minecraft-inventory-gui.png',
    fullPage: false
  });
  console.log('Captured evidence/FEAT-014-minecraft-inventory-gui.png');

  // 2. Click "Missing" tab
  console.log('Clicking "Missing" tab filter...');
  const missingPill = await page.locator('button.pill-btn:has-text("Missing")');
  await missingPill.click();
  await page.waitForTimeout(500);

  // Hover over an upgradable slot if present (or first slot)
  const upgradableSlot = await page.$('.mc-slot.slot-upgradable');
  if (upgradableSlot) {
    await upgradableSlot.hover();
    await page.waitForTimeout(500);
  }

  await page.screenshot({
    path: 'evidence/FEAT-013-upgradable-in-missing.png',
    fullPage: false
  });
  console.log('Captured evidence/FEAT-013-upgradable-in-missing.png');

  // 3. Click the upgradable slot to inspect the modal with dual tags
  if (upgradableSlot) {
    await upgradableSlot.click();
    await page.waitForSelector('.modal-content');
    await page.waitForTimeout(400);

    await page.screenshot({
      path: 'evidence/FEAT-013-upgradable-modal-dual-tags.png',
      fullPage: false
    });
    console.log('Captured evidence/FEAT-013-upgradable-modal-dual-tags.png');

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 4. Switch to Card Grid view to verify dual tags in card grid view
  console.log('Switching to Card Grid View...');
  const cardGridBtn = await page.locator('button.view-tab-btn:has-text("Card Grid View")');
  await cardGridBtn.click();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'evidence/FEAT-013-cards-dual-tags.png',
    fullPage: false
  });
  console.log('Captured evidence/FEAT-013-cards-dual-tags.png');

  await browser.close();
  console.log('Visual capture complete!');
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
