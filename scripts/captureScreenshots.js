import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  if (!fs.existsSync('evidence')) {
    fs.mkdirSync('evidence', { recursive: true });
  }

  let server = null;
  try {
    const res = await fetch('http://localhost:5173');
    if (res.ok) console.log('Using already running dev server on http://localhost:5173');
  } catch {
    console.log('Starting Vite preview server...');
    server = spawn('npx', ['vite', 'preview', '--port', '5173'], {
      stdio: 'pipe',
      shell: true
    });
    await new Promise(resolve => setTimeout(resolve, 2500));
  }

  console.log('Launching Playwright Chromium...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // FEAT-007: Visual Hero & Stats Overview
    console.log('Capturing FEAT-007-visual-hero.png...');
    await page.screenshot({
      path: 'evidence/FEAT-007-visual-hero.png',
      fullPage: false
    });

    // FEAT-008: Grid & Filter System - Click "Missing" filter pill
    console.log('Clicking Missing filter pill...');
    const missingBtn = page.locator('button:has-text("❌ Missing")');
    await missingBtn.click();
    await page.waitForTimeout(500);

    console.log('Capturing FEAT-008-grid-filter.png...');
    await page.screenshot({
      path: 'evidence/FEAT-008-grid-filter.png',
      fullPage: false
    });

    // FEAT-009: Accessory Card & Interactive Detail Modal - Click first visible card
    console.log('Clicking accessory card to open modal...');
    const firstCard = page.locator('.accessory-card').first();
    await firstCard.click();
    await page.waitForTimeout(600);

    console.log('Capturing FEAT-009-modal-details.png...');
    await page.screenshot({
      path: 'evidence/FEAT-009-modal-details.png',
      fullPage: false
    });

    console.log('Screenshots captured successfully!');
  } finally {
    await browser.close();
    if (server) server.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
