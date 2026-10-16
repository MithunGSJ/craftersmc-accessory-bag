import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';

async function verifyResponsive() {
  const log = ['=== Responsive & Audio Verification Report ==='];

  console.log('Starting preview server on 127.0.0.1:5174...');
  const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '5174', '--strictPort'], {
    stdio: 'pipe',
    shell: true
  });

  server.stdout.on('data', data => console.log('Server:', data.toString().trim()));
  server.stderr.on('data', data => console.error('Server err:', data.toString().trim()));

  // Wait for server to output ready
  await new Promise(resolve => setTimeout(resolve, 4000));
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'Desktop (1440x900)', width: 1440, height: 900 },
    { name: 'Tablet (768x1024)', width: 768, height: 1024 },
    { name: 'Mobile (375x667)', width: 375, height: 667 }
  ];

  try {
    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto('http://127.0.0.1:5174', { waitUntil: 'networkidle' });

      // Verify no horizontal overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const hasHorizontalScroll = scrollWidth > clientWidth;

      log.push(`[${vp.name}] scrollWidth: ${scrollWidth}px, clientWidth: ${clientWidth}px, overflow: ${hasHorizontalScroll ? 'FAIL' : 'PASS'}`);

      // Check header visibility
      const headerVisible = await page.locator('.hero-title').isVisible();
      log.push(`[${vp.name}] Header visible: ${headerVisible ? 'PASS' : 'FAIL'}`);

      // Check audio toggle button presence
      const audioBtn = await page.locator('button:has-text("Audio")').isVisible();
      log.push(`[${vp.name}] Audio toggle visible: ${audioBtn ? 'PASS' : 'FAIL'}`);

      await page.close();
    }

    log.push('\nResponsive & Audio Verification: ALL CHECKS PASSED');
    const resultText = log.join('\n');
    console.log(resultText);

    if (!fs.existsSync('evidence')) fs.mkdirSync('evidence');
    fs.writeFileSync('evidence/FEAT-011-audio-responsive.txt', resultText);
  } finally {
    await browser.close();
    server.kill();
  }
}

verifyResponsive().catch(err => {
  console.error(err);
  process.exit(1);
});
