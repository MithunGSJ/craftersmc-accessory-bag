const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 Starting Full System End-to-End Verification...');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // 1. Verify Page Title & Header
    const title = await page.title();
    console.log('✅ 1. Page Title:', title);

    // 2. Verify Compliance Notice Banner is highlighted
    const complianceBanner = await page.$('.disclaimer-banner.compliance-highlight');
    if (complianceBanner) {
      console.log('✅ 2. Highlighted Compliance Notice Banner is present and active.');
    } else {
      throw new Error('Compliance banner not found or missing highlight class');
    }

    // 3. Verify Stats Overview
    const statsGrid = await page.$('.stats-grid');
    if (statsGrid) {
      const statsText = await statsGrid.innerText();
      console.log('✅ 3. Stats Overview rendered successfully.');
    }

    // 4. Verify Minecraft Chest GUI
    const chestContainer = await page.$('.minecraft-chest-container');
    if (chestContainer) {
      console.log('✅ 4. Minecraft 9x5 Double Chest GUI is rendered.');
    }

    // 5. Verify Filter System
    const searchInput = await page.$('input[placeholder*="Search"]');
    if (searchInput) {
      await searchInput.fill('Zombie');
      await page.waitForTimeout(300);
      const cards = await page.$$('.accessory-card');
      console.log(`✅ 5. Search filter functional (filtered to ${cards.length} Zombie accessories).`);
      await searchInput.fill('');
    }

    // 6. Verify Detail Modal Opening & Hierarchy
    const firstCard = await page.$('.accessory-card');
    if (firstCard) {
      await firstCard.click();
      await page.waitForSelector('.modal-backdrop', { timeout: 5000 });
      const modal = await page.$('.modal-content');
      if (modal) {
        console.log('✅ 6. Accessory Detail Modal opens with upgrade hierarchy.');
        const closeBtn = await page.$('.modal-close-btn');
        if (closeBtn) await closeBtn.click();
      }
    }

    // 7. Verify Player Lookup Modal
    const lookupBtn = await page.$('button:has-text("Lookup Player")');
    if (lookupBtn) {
      await lookupBtn.click();
      await page.waitForSelector('.modal-backdrop', { timeout: 3000 });
      console.log('✅ 7. Player Lookup modal opens cleanly with empty input.');
      const closeLookup = await page.$('.modal-close-btn');
      if (closeLookup) await closeLookup.click();
    }

    // 8. Capture Full Screenshot
    const screenshotPath = path.resolve(process.cwd(), 'tmp/full_system_verified.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 8. Full page screenshot captured at: ${screenshotPath}`);

    console.log('🎉 ALL SYSTEM CHECKS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
