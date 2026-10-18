const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Switch to Minecraft Inventory View
  const chestTab = page.locator('button:has-text("Minecraft Inventory View")').first();
  await chestTab.click();
  await page.waitForTimeout(500);

  // Hover over an empty or non-empty slot or let's inspect the DOM
  // Let's inject a hoveredItem or hover over a slot
  await page.evaluate(() => {
    // find a slot
    const slot = document.querySelector('.mc-slot');
    if (slot) {
      slot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    }
  });

  await page.waitForTimeout(500);
  const screenshotPath = path.resolve('tmp/tooltip_view.png');
  await page.screenshot({ path: screenshotPath });
  console.log('📸 Screenshot saved to:', screenshotPath);

  await browser.close();
})();
