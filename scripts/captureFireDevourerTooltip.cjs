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

  // Load an accessory into the slot or evaluate tooltip for FIRE_DEVOURER directly
  await page.evaluate(() => {
    // Inject a tooltip directly into DOM to capture its exact rendering
    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'mc-tooltip';
    tooltipEl.style.left = '400px';
    tooltipEl.style.top = '250px';
    tooltipEl.id = 'test-fire-devourer-tooltip';
    tooltipEl.innerHTML = `
      <div class="mc-tooltip-title" style="color: #FF55FF;">Fire Devourer</div>
      <div style="margin: 4px 0; font-size: 18px;">
        <span style="color: #55FF55;">✔ OWNED</span>
      </div>
      <div class="mc-tooltip-desc">
        Reduces damage you get from Fire mobs by 20%. (Eye of the Cliff, Fire Envoy and Heartigniter)
      </div>
      <div style="color: #55FFFF; margin: 4px 0; font-weight: bold; font-size: 18px;">
        Magical Power: +12 MP
      </div>
      <div style="color: #FFAA00; font-size: 16px; margin-top: 4px;">
        <div style="color: #55FF55;">🌾 Craft: ~13.2M (Bazaar)</div>
        <div style="color: #AAAAAA; font-size: 15px;">AH Range: Min 25.0M - Avg 25.0M</div>
      </div>
      <div class="mc-tooltip-footer" style="color: #FF55FF;">
        EPIC ACCESSORY
      </div>
      <div style="color: #888888; font-size: 14px; margin-top: 2px;">
        (Click to view crafting recipe &amp; details)
      </div>
    `;
    document.body.appendChild(tooltipEl);
  });

  await page.waitForTimeout(500);
  const target = page.locator('#test-fire-devourer-tooltip');
  const screenshotPath = path.resolve('tmp/fire_devourer_crisp_tooltip.png');
  await target.screenshot({ path: screenshotPath });
  console.log('📸 Screenshot saved to:', screenshotPath);

  await browser.close();
})();
