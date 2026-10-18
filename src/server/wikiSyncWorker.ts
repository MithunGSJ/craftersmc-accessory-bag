import fs from 'fs';
import path from 'path';
import { runWikiSync } from '../../scripts/syncWikiData.ts';

export interface WikiSyncStatus {
  readonly intervalMinutes: number;
  readonly lastSyncTime: number | null;
  readonly nextSyncTime: number | null;
  readonly isSyncing: boolean;
  readonly totalAccessories: number;
  readonly totalRecipes: number;
  readonly lastError?: string;
}

const INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
let lastSyncTime: number | null = null;
let nextSyncTime: number | null = null;
let isSyncing = false;
let lastError: string | undefined;
let intervalTimer: ReturnType<typeof setInterval> | null = null;

function getCounts(): { totalAccessories: number; totalRecipes: number } {
  let totalAccessories = 0;
  let totalRecipes = 0;
  const accPath = path.resolve(process.cwd(), 'src/data/wikiAccessories.json');
  const recPath = path.resolve(process.cwd(), 'src/data/wikiRecipes.json');

  if (fs.existsSync(accPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(accPath, 'utf8'));
      if (Array.isArray(data)) totalAccessories = data.length;
    } catch {
      // ignore
    }
  }

  if (fs.existsSync(recPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(recPath, 'utf8'));
      totalRecipes = Object.keys(data).length;
    } catch {
      // ignore
    }
  }

  return { totalAccessories, totalRecipes };
}

export async function triggerWikiSync(): Promise<{ success: boolean; error?: string }> {
  if (isSyncing) {
    return { success: false, error: 'Sync already in progress' };
  }

  isSyncing = true;
  lastError = undefined;
  console.log(`[WikiSyncWorker] Starting 30-min scheduled wiki sync at ${new Date().toISOString()}...`);

  try {
    await runWikiSync();
    lastSyncTime = Date.now();
    nextSyncTime = lastSyncTime + INTERVAL_MS;
    console.log(`[WikiSyncWorker] Wiki sync completed successfully. Next check at ${new Date(nextSyncTime).toISOString()}.`);
    return { success: true };
  } catch (err: unknown) {
    lastError = err instanceof Error ? err.message : String(err);
    console.error(`[WikiSyncWorker] Wiki sync failed:`, lastError);
    return { success: false, error: lastError };
  } finally {
    isSyncing = false;
  }
}

export function getWikiSyncStatus(): WikiSyncStatus {
  const { totalAccessories, totalRecipes } = getCounts();
  return {
    intervalMinutes: 30,
    lastSyncTime,
    nextSyncTime: nextSyncTime || (lastSyncTime ? lastSyncTime + INTERVAL_MS : Date.now() + INTERVAL_MS),
    isSyncing,
    totalAccessories,
    totalRecipes,
    lastError
  };
}

export function startWikiSyncWorker(): void {
  if (intervalTimer) return; // already started

  nextSyncTime = Date.now() + INTERVAL_MS;
  console.log(`[WikiSyncWorker] Background 30-minute wiki polling active. Next sync scheduled at ${new Date(nextSyncTime).toISOString()}.`);

  intervalTimer = setInterval(() => {
    void triggerWikiSync();
  }, INTERVAL_MS);
}
