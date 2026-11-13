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
  
  // Normalize and prevent directory traversal
  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const publicDir = path.resolve(process.cwd(), 'public');

  let filePath = path.resolve(distDir, '.' + safePath);
  if (!filePath.startsWith(distDir) || !fs.existsSync(filePath)) {
    filePath = path.resolve(publicDir, '.' + safePath);
  }

  // Ensure filePath stays within distDir or publicDir
  const isSafe = filePath.startsWith(distDir) || filePath.startsWith(publicDir);

  if (isSafe && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

server.listen(4174, async () => {
  console.log('Static server listening on port 4174');
  
  const testResultsDir = path.resolve(process.cwd(), 'test-results');
  if (!fs.existsSync(testResultsDir)) fs.mkdirSync(testResultsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  
  // Mobile viewport: 360x800 with DPR 3 (matching Android test device in user screenshot)
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();
  await page.goto('http://localhost:4174', { waitUntil: 'networkidle' });

  // 1. Click Lookup Player
  const lookupBtn = page.locator('button:has-text("Lookup Player")');
  await lookupBtn.click();
  await page.waitForTimeout(400);

  // 2. Click "Test Player" to load 43 authentic owned accessories
  const testPlayerBtn = page.locator('button:has-text("Test Player")');
  await testPlayerBtn.click();
  await page.waitForTimeout(600);

  // 3. Switch to Minecraft Inventory View
  const mcViewBtn = page.locator('button:has-text("Minecraft Inventory View")');
  if (await mcViewBtn.isVisible()) {
    await mcViewBtn.click();
    await page.waitForTimeout(500);
  }

  const container = page.locator('.mc-gui-container');
  await container.waitFor({ state: 'visible', timeout: 5000 });

  const containerBox = await container.boundingBox();
  const grid = page.locator('.mc-gui-grid');
  const gridBox = await grid.boundingBox();

  console.log('Populated Container Bounding Box:', containerBox);
  console.log('Populated Grid Bounding Box:', gridBox);

  const gridFitsHorizontally = (gridBox.x >= containerBox.x) &&
    ((gridBox.x + gridBox.width) <= (containerBox.x + containerBox.width + 0.5));
  const containerFitsInViewport = (containerBox.x + containerBox.width) <= 360.5;

  console.log('Grid fits horizontally inside container:', gridFitsHorizontally);
  console.log('Container fits horizontally in 360px viewport:', containerFitsInViewport);

  // Check occupied slot boundaries and icon sizing
  const occupiedSlots = await page.locator('.mc-slot.occupied').all();
  console.log(`Occupied slots loaded: ${occupiedSlots.length}`);

  let allIconsContained = true;
  for (let i = 0; i < Math.min(occupiedSlots.length, 9); i++) {
    const sBox = await occupiedSlots[i].boundingBox();
    const icon = occupiedSlots[i].locator('img.accessory-icon, .accessory-icon');
    if (await icon.count() > 0) {
      const iBox = await icon.first().boundingBox();
      if (sBox && iBox) {
        const iconFitsInSlot = (iBox.x >= sBox.x) &&
          (iBox.x + iBox.width <= sBox.x + sBox.width + 1) &&
          (iBox.y >= sBox.y) &&
          (iBox.y + iBox.height <= sBox.y + sBox.height + 1);
        if (!iconFitsInSlot) {
          allIconsContained = false;
          console.log(`Icon overflow in slot ${i}: Slot(${sBox.x}, ${sBox.width}) Icon(${iBox.x}, ${iBox.width})`);
        }
      }
    }
  }

  console.log('All slot icons strictly contained within slot bounds:', allIconsContained);

  // Take mobile populated screenshot
  const populatedScreenshotPath = path.join(testResultsDir, 'mobile-inventory-populated.png');
  await container.screenshot({ path: populatedScreenshotPath });
  console.log(`Saved populated screenshot to: ${populatedScreenshotPath}`);

  // Save metrics report
  const report = {
    viewport: { width: 360, height: 800, dpr: 3 },
    occupiedSlotsCount: occupiedSlots.length,
    containerBox,
    gridBox,
    gridFitsHorizontally,
    containerFitsInViewport,
    allIconsContained,
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(path.join(testResultsDir, 'mobile-layout-metrics.json'), JSON.stringify(report, null, 2), 'utf8');

  await browser.close();
  server.close(() => {
    console.log('Visual verification script finished successfully.');
    process.exit(gridFitsHorizontally && containerFitsInViewport && allIconsContained ? 0 : 1);
  });
});
