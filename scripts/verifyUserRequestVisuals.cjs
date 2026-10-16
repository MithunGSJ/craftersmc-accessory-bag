const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  if (!fs.existsSync('evidence')) fs.mkdirSync('evidence', { recursive: true });

  // 1. Check Minecraft Inventory View
  console.log('Inspecting Minecraft Inventory View...');
  await page.waitForSelector('.mc-gui-container');

  // Verify chest slots: only owned items, slot-ordered
  const slots = await page.$$eval('.mc-slot.occupied', els => {
    return els.map(el => {
      const img = el.querySelector('img');
      const title = el.getAttribute('aria-label') || el.innerText;
      return { title, imgSrc: img ? img.src : null };
    });
  });
  console.log(`Found ${slots.length} occupied slots in chest GUI`);

  // Hover over the first occupied slot to inspect tooltip
  const firstSlot = await page.$('.mc-slot.occupied');
  if (firstSlot) {
    await firstSlot.hover();
    await page.waitForTimeout(400);
  }

  await page.screenshot({
    path: 'evidence/mc-inventory-chest-nbt-order.png',
    fullPage: false
  });
  console.log('Saved evidence/mc-inventory-chest-nbt-order.png');

  // 2. Scroll down to inspect Missing & Upgradable accessories section at the bottom of the Minecraft Inventory View
  console.log('Inspecting Missing & Upgradable accessories cards at bottom...');
  const bottomSection = await page.$('.mc-missing-section');
  if (bottomSection) {
    await bottomSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: 'evidence/mc-inventory-bottom-cards.png',
      fullPage: false
    });
    console.log('Saved evidence/mc-inventory-bottom-cards.png');
  }

  // 3. Switch to Card Grid view to test Pig's Foot and verify all accessory cards
  console.log('Switching to Card Grid View...');
  const cardGridBtn = await page.locator('button.view-tab-btn:has-text("Card Grid View")');
  await cardGridBtn.click();
  await page.waitForTimeout(400);

  // Search and verify Pig's Foot icon
  console.log('Searching for Pig\'s Foot...');
  const searchInput = await page.locator('input.search-input');
  await searchInput.fill("Pig's Foot");
  await page.waitForTimeout(500);

  // Check the image element inside the Pig's Foot card
  const pigsFootImg = await page.locator('.accessory-card img[alt="Pig\'s Foot"]').first();
  const isVisible = await pigsFootImg.isVisible();
  const naturalWidth = await pigsFootImg.evaluate(img => img.naturalWidth);
  const naturalHeight = await pigsFootImg.evaluate(img => img.naturalHeight);
  const imgSrc = await pigsFootImg.evaluate(img => img.src);
  console.log(`Pig's Foot image visible: ${isVisible}, natural dimensions: ${naturalWidth}x${naturalHeight}, src: ${imgSrc}`);

  await page.screenshot({
    path: 'evidence/pigs-foot-icon-verified.png',
    fullPage: false
  });
  console.log('Saved evidence/pigs-foot-icon-verified.png');

  // 4. Clear search, search Frostclaw Relic, open modal and capture recipe
  await searchInput.fill('Frostclaw Relic');
  await page.waitForTimeout(400);
  const frostclawCard = await page.locator('.accessory-card:has-text("Frostclaw Relic")').first();
  await frostclawCard.click();
  await page.waitForSelector('.modal-content');
  await page.waitForTimeout(400);

  await page.screenshot({
    path: 'evidence/modal-frostclaw-relic.png',
    fullPage: false
  });
  console.log('Saved evidence/modal-frostclaw-relic.png');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 5. Search Fire Devourer, open modal and capture recipe
  await searchInput.fill('Fire Devourer');
  await page.waitForTimeout(400);
  const devourerCard = await page.locator('.accessory-card:has-text("Fire Devourer")').first();
  await devourerCard.click();
  await page.waitForSelector('.modal-content');
  await page.waitForTimeout(400);

  await page.screenshot({
    path: 'evidence/modal-fire-devourer.png',
    fullPage: false
  });
  console.log('Saved evidence/modal-fire-devourer.png');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 6. Search Fire Extinguisher, open modal and capture recipe
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
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // 7. Search Reaper Orb, open modal and capture recipe
  await searchInput.fill('Reaper Orb');
  await page.waitForTimeout(400);
  const reaperCard = await page.locator('.accessory-card:has-text("Reaper Orb")').first();
  await reaperCard.click();
  await page.waitForSelector('.modal-content');
  await page.waitForTimeout(400);

  await page.screenshot({
    path: 'evidence/modal-reaper-orb.png',
    fullPage: false
  });
  console.log('Saved evidence/modal-reaper-orb.png');
  await page.keyboard.press('Escape');

  await browser.close();
  console.log('Verification completed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
