import { runWikiSync } from './syncWikiData.ts';

const INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

async function loop(): Promise<void> {
  const now = new Date().toLocaleTimeString();
  console.log(`\n⏰ [${now}] Checking CraftersMC MediaWiki for new accessories & recipes...`);

  try {
    const stats = await runWikiSync();
    console.log(`✅ [${now}] Wiki check finished: ${stats.scrapedCount} accessories, ${stats.downloadedSprites} new sprites downloaded.`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ [${now}] Error during wiki check:`, message);
  }

  const nextTime = new Date(Date.now() + INTERVAL_MS).toLocaleTimeString();
  console.log(`⏳ Next scheduled wiki check at ${nextTime} (30 mins). Press Ctrl+C to exit.`);

  setTimeout(() => {
    void loop();
  }, INTERVAL_MS);
}

console.log('🚀 CraftersMC Wiki 30-Minute Polling Service Initialized.');
void loop();
