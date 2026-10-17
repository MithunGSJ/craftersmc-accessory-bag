import fs from 'fs';
import path from 'path';

interface ScrapedAccessory {
  id: string;
  name: string;
  rarity: string;
  description: string;
  source: string;
  imageFileName?: string;
  spriteUrl?: string;
}

const WIKI_API_URL = 'https://craftersmc.wiki.gg/api.php?action=parse&page=Accessories&prop=text&format=json';
const WIKI_BASE_IMAGE_URL = 'https://craftersmc.wiki.gg/images';
const ICONS_DIR = path.resolve(process.cwd(), 'public/icons/accessories');

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRarity(tdHtml: string): string {
  const match = tdHtml.match(/Icon_([A-Za-z]+)\.png|Icon\s+([A-Za-z]+)\.png/i);
  if (match) {
    const raw = (match[1] || match[2]).toUpperCase();
    if (raw === 'VERY_SPECIAL' || raw === 'VERY SPECIAL') return 'VERY_SPECIAL';
    return raw;
  }
  return 'COMMON';
}

async function fetchWithRetry(url: string, init?: RequestInit, retries = 3): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(30000)
      });
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, attempt * 1500));
      }
    }
  }
  throw lastError;
}

export async function scrapeWikiAccessories(): Promise<ScrapedAccessory[]> {
  const res = await fetchWithRetry(WIKI_API_URL, {
    headers: { 'User-Agent': 'CraftersMCAccessoryScraper/1.0' }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch wiki page: HTTP ${res.status}`);
  }

  const data = await res.json();
  const html: string = data.parse?.text?.['*'] || '';
  const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];

  const accessories: ScrapedAccessory[] = [];

  for (const row of rows) {
    // Skip table header rows
    if (row.includes('<th')) continue;

    const cells = row.match(/<td[\s\S]*?<\/td>/gi) || [];
    if (cells.length < 4) continue;

    // Cell 0: Icon + Name
    const imgMatch = cells[0].match(/<img\s+alt="([^"]+\.png)"/i);
    const imageFileName = imgMatch
      ? imgMatch[1]
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/\s+/g, '_')
      : undefined;

    const nameMatch =
      cells[0].match(/class="mcfont">([^<]+)<\/span>/i) ||
      cells[0].match(/title="([^"]+)"/i);
    if (!nameMatch) continue;

    const name = nameMatch[1].trim();
    const id = name.toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

    // Cell 1: Rarity
    const rarity = parseRarity(cells[1]);

    // Cell 2: Description
    const description = stripHtml(cells[2]);

    // Cell 3: Source / Obtaining
    const source = stripHtml(cells[3]);

    const spriteUrl = imageFileName ? `${WIKI_BASE_IMAGE_URL}/${imageFileName}` : undefined;

    accessories.push({
      id,
      name,
      rarity,
      description,
      source,
      imageFileName,
      spriteUrl
    });
  }

  return accessories;
}

export async function downloadSprite(url: string, targetPath: string): Promise<boolean> {
  try {
    const res = await fetchWithRetry(url, {
      headers: { 'User-Agent': 'CraftersMCAccessoryScraper/1.0' }
    });
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(targetPath, Buffer.from(arrayBuffer));
    return true;
  } catch {
    return false;
  }
}

export async function runWikiSync(): Promise<{
  scrapedCount: number;
  downloadedSprites: number;
  existingSprites: number;
  failedSprites: number;
  items: ScrapedAccessory[];
}> {
  console.log('🔄 Connecting to CraftersMC MediaWiki API...');
  const items = await scrapeWikiAccessories();
  console.log(`✅ Parsed ${items.length} accessories from official Wiki table.`);

  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  let downloadedSprites = 0;
  let existingSprites = 0;
  let failedSprites = 0;

  for (const item of items) {
    if (!item.spriteUrl) continue;
    const fileName = `${item.id.toLowerCase()}.png`;
    const targetPath = path.join(ICONS_DIR, fileName);

    if (fs.existsSync(targetPath)) {
      existingSprites++;
    } else {
      console.log(`📥 Downloading missing sprite for ${item.name}: ${item.spriteUrl}`);
      const success = await downloadSprite(item.spriteUrl, targetPath);
      if (success) {
        downloadedSprites++;
      } else {
        failedSprites++;
      }
    }
  }

  console.log(`📊 Wiki Sync Complete: ${items.length} items parsed, ${existingSprites} sprites existing, ${downloadedSprites} downloaded, ${failedSprites} failed.`);

  return {
    scrapedCount: items.length,
    downloadedSprites,
    existingSprites,
    failedSprites,
    items
  };
}

if (process.argv[1] && process.argv[1].endsWith('syncWikiData.ts')) {
  runWikiSync()
    .then(stats => {
      const evidencePath = path.resolve(process.cwd(), 'tmp/evidence_feat_027_wiki_sync.json');
      if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
      fs.writeFileSync(evidencePath, JSON.stringify(stats, null, 2));
      console.log(`📝 Evidence saved to ${evidencePath}`);
    })
    .catch(err => {
      console.error('❌ Wiki sync failed:', err);
      process.exit(1);
    });
}
