import { chromium } from 'playwright';
import fs from 'fs';

async function main() {
  if (!fs.existsSync('evidence')) {
    fs.mkdirSync('evidence', { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // 1. Hero & Stats Overview
    await page.screenshot({
      path: 'evidence/FEAT-007-visual-hero.png',
      fullPage: false
    });

    // 2. Scroll to Grid to see accessories, icons, and pricing badges
    await page.evaluate(() => window.scrollTo(0, 480));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'evidence/FEAT-008-grid-filter.png',
      fullPage: false
    });

    // 3. Search for Feather
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('Feather');
    await page.waitForTimeout(500);

    // Click on Golden Feather Boots
    const bootsCard = page.locator('.accessory-card:has-text("Golden Feather Boots")');
    if (await bootsCard.count() > 0) {
      await bootsCard.first().click();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: 'evidence/FEAT-010-feather-boots-pricing.png',
        fullPage: false
      });

      const closeBtn = page.locator('.modal-close-btn');
      await closeBtn.click();
      await page.waitForTimeout(400);
    }

    // 4. Click Feather Artifact
    const artifactCard = page.locator('.accessory-card:has-text("Feather Artifact")');
    if (await artifactCard.count() > 0) {
      await artifactCard.first().click();
      await page.waitForTimeout(600);

      await page.screenshot({
        path: 'evidence/FEAT-009-modal-details.png',
        fullPage: false
      });
    }

    console.log('Done capturing grid screenshot!');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
