import fs from 'fs';
import path from 'path';

import { extractRecipesForAccessory, ScrapedAccessoryRecipe } from './extractWikiRecipes.ts';
import { evaluateObtainability, isObtainableAccessory } from '../src/logic/wikiBrain.ts';

export interface ScrapedAccessory {
  id: string;
  name: string;
  rarity: string;
  description: string;
  source: string;
  imageFileName?: string;
  spriteUrl?: string;
  isObtainable?: boolean;
  statusFlag?: string;
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

async function fetchWithRetry(url: string, init?: RequestInit, retries = 4): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(30000)
      });
      if (!res.ok && (res.status >= 500 || res.status === 429)) {
        console.warn(`⏳ HTTP ${res.status} from ${url} (attempt ${attempt}/${retries}). Retrying...`);
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, attempt * 3000));
          continue;
        }
      }
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, attempt * 3000));
      }
    }
  }
  throw lastError || new Error(`Network request failed after ${retries} attempts`);
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
    const cell0 = cells[0];
    const cell1 = cells[1];
    const cell2 = cells[2];
    const cell3 = cells[3];
    if (!cell0 || !cell1 || !cell2 || !cell3) continue;

    // Cell 0: Icon + Name
    const imgMatch = cell0.match(/<img\s+alt="([^"]+\.png)"/i);
    const imageFileName = imgMatch
      ? imgMatch[1]
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/\s+/g, '_')
      : undefined;

    const nameMatch =
      cell0.match(/class="mcfont">([^<]+)<\/span>/i) ||
      cell0.match(/title="([^"]+)"/i);
    if (!nameMatch) continue;

    const rawName = nameMatch[1].trim();
    const name = rawName
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
    const cleanForId = name.replace(/['’]/g, '').trim();
    const id = cleanForId.toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

    // Cell 1: Rarity
    const rarity = parseRarity(cell1);

    // Cell 2: Description
    const description = stripHtml(cell2);

    // Cell 3: Source / Obtaining
    const source = stripHtml(cell3);

    const spriteUrl = imageFileName ? `${WIKI_BASE_IMAGE_URL}/${imageFileName}` : undefined;
    const obtainability = evaluateObtainability({ name, source, description });

    accessories.push({
      id,
      name,
      rarity,
      description,
      source,
      imageFileName,
      spriteUrl,
      isObtainable: obtainability.isObtainable,
      statusFlag: obtainability.status
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
  let items: ScrapedAccessory[] = [];
  const wikiAccessoriesPath = path.resolve(process.cwd(), 'src/data/wikiAccessories.json');

  try {
    items = await scrapeWikiAccessories();
    console.log(`✅ Parsed ${items.length} accessories from official Wiki table.`);
  } catch (err: unknown) {
    if (fs.existsSync(wikiAccessoriesPath)) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`⚠️ Warning: MediaWiki API request failed (${errMsg}). Preserving existing cached catalog.`);
      try {
        items = JSON.parse(fs.readFileSync(wikiAccessoriesPath, 'utf8'));
        console.log(`📦 Loaded ${items.length} accessories from existing cache.`);
      } catch {
        throw err;
      }
    } else {
      throw err;
    }
  }

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

  // Save parsed accessories to wikiAccessories.json
  fs.writeFileSync(wikiAccessoriesPath, JSON.stringify(items, null, 2));

  // Scrape crafting recipes from wiki pages
  const wikiRecipesPath = path.resolve(process.cwd(), 'src/data/wikiRecipes.json');
  const recipesMap: Record<string, ScrapedAccessoryRecipe> = {};
  if (fs.existsSync(wikiRecipesPath)) {
    try {
      Object.assign(recipesMap, JSON.parse(fs.readFileSync(wikiRecipesPath, 'utf8')));
    } catch {
      // ignore parse error
    }
  }

  let scrapedRecipes = 0;
  for (const item of items) {
    if (!isObtainableAccessory(item)) continue;
    const isCrafted = item.source.toLowerCase().includes('craft') || item.source.toLowerCase().includes('collection');
    if (isCrafted && !recipesMap[item.id]) {
      const pageTitle = item.name.replace(/ /g, '_');
      const extracted = await extractRecipesForAccessory(pageTitle);
      for (const r of extracted) {
        recipesMap[r.targetId] = r;
        scrapedRecipes++;
      }
    }
  }
  fs.writeFileSync(wikiRecipesPath, JSON.stringify(recipesMap, null, 2));
  console.log(`📜 Wiki recipes synced: ${Object.keys(recipesMap).length} total recipes (${scrapedRecipes} newly scraped).`);

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
