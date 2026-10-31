const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(process.cwd(), 'dist');
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(distDir, reqPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), 'public', reqPath);
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

server.listen(4175, async () => {
  console.log('Server running on 4175');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  const page = await context.newPage();
  await page.goto('http://localhost:4175', { waitUntil: 'networkidle' });

  // 1. Switch to Card Grid View to view all cards easily
  const cardGridViewBtn = page.locator('button:has-text("Card Grid View")');
  if (await cardGridViewBtn.isVisible()) {
    await cardGridViewBtn.click();
    await page.waitForTimeout(400);
  }

  // 2. Search for "Draconic Artifact"
  const searchInput = page.locator('input[placeholder*="Search"]');
  if (await searchInput.isVisible()) {
    await searchInput.fill('Draconic Artifact');
    await page.waitForTimeout(400);
  }

  // Find Draconic Artifact card
  const draconicCard = page.locator('.accessory-card:has-text("Draconic Artifact")');
  await draconicCard.waitFor({ state: 'visible', timeout: 5000 });

  // Verify recipe section exists
  const recipeSection = draconicCard.locator('.card-recipe-section');
  const hasRecipe = await recipeSection.isVisible();
  console.log('Draconic Artifact card has recipe section:', hasRecipe);

  // Take screenshot of the card with recipe section
  const cardScreenshotPath = path.resolve(process.cwd(), 'test-results/card-recipe-preview.png');
  await draconicCard.screenshot({ path: cardScreenshotPath });
  console.log('Saved card screenshot to:', cardScreenshotPath);

  // Click on Draconic Ring chip inside the recipe
  const ringChip = draconicCard.locator('button.card-recipe-chip-link:has-text("Draconic Ring")');
  const hasRingChip = await ringChip.isVisible();
  console.log('Has Draconic Ring redirect chip:', hasRingChip);

  await ringChip.click();
  await page.waitForTimeout(500);

  // Verify modal opens for Draconic Ring
  const modal = page.locator('.modal-content');
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  const modalTitle = await modal.locator('h2').textContent();
  console.log('Redirected Modal Title:', modalTitle);

  const redirectedCorrectly = modalTitle?.includes('Draconic Ring');
  console.log('Redirected correctly to Draconic Ring:', redirectedCorrectly);

  // Take screenshot of redirected modal
  const modalScreenshotPath = path.resolve(process.cwd(), 'test-results/card-recipe-redirect.png');
  await modal.screenshot({ path: modalScreenshotPath });
  console.log('Saved modal screenshot to:', modalScreenshotPath);

  await browser.close();
  server.close(() => {
    console.log('Visual card redirect verification complete.');
    process.exit(hasRecipe && hasRingChip && redirectedCorrectly ? 0 : 1);
  });
});

