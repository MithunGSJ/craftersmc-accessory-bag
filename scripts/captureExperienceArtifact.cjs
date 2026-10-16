const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  if (!fs.existsSync('evidence')) {
    fs.mkdirSync('evidence', { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Search for Experience Artifact
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('Experience');
    await page.waitForTimeout(600);

    // Click Experience Artifact card
    const card = page.locator('.accessory-card:has-text("Experience Artifact")');
    if (await card.count() > 0) {
      await card.first().click();
      await page.waitForTimeout(700);

      await page.screenshot({
        path: 'evidence/FEAT-013-experience-artifact-audit.png',
        fullPage: false
      });
      console.log('Captured evidence/FEAT-013-experience-artifact-audit.png successfully!');
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
