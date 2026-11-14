import { AccessoryCategory, AccessoryDefinition } from '../data/accessoryTypes.ts';

export type ObtainabilityStatus = 'OBTAINABLE' | 'ADMIN_ONLY' | 'REMOVED' | 'UNOBTAINABLE';

export interface WikiIntelligenceResult {
  readonly isObtainable: boolean;
  readonly status: ObtainabilityStatus;
  readonly reason?: string;
  readonly category: AccessoryCategory;
  readonly stage?: AccessoryDefinition['stage'];
}

export function evaluateObtainability(item: {
  readonly name: string;
  readonly source?: string;
  readonly description?: string;
  readonly wikitext?: string;
}): { isObtainable: boolean; status: ObtainabilityStatus; reason?: string } {
  const combined = `${item.name} ${item.source || ''} ${item.description || ''} ${item.wikitext || ''}`.toLowerCase();

  // 1. Admin-only check
  if (
    combined.includes('{{ambox admin}}') ||
    combined.includes('admin-only') ||
    combined.includes('admin only') ||
    combined.includes('staff-only') ||
    combined.includes('for admins')
  ) {
    return { isObtainable: false, status: 'ADMIN_ONLY', reason: 'Admin-exclusive accessory' };
  }

  // 2. Removed from game check
  if (
    combined.includes('{{ambox removed}}') ||
    combined.includes('source: removed') ||
    combined.includes('was a special') ||
    combined.includes('was an accessory') ||
    (item.source && item.source.toLowerCase().trim() === 'removed')
  ) {
    return { isObtainable: false, status: 'REMOVED', reason: 'Removed from active gameplay' };
  }

  // 3. Unobtainable / developer reward check
  if (
    combined.includes('unobtainable') ||
    combined.includes('awarded to [player]') ||
    combined.includes('reporting a bug that could break the game') ||
    combined.includes('presenting a creative idea that has been added')
  ) {
    return { isObtainable: false, status: 'UNOBTAINABLE', reason: 'Exclusive one-time trophy or unobtainable' };
  }

  return { isObtainable: true, status: 'OBTAINABLE' };
}

export function isObtainableAccessory(item: {
  readonly name: string;
  readonly source?: string;
  readonly description?: string;
  readonly wikitext?: string;
}): boolean {
  return evaluateObtainability(item).isObtainable;
}

const ROMAN_MAP: Record<string, number> = {
  i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10,
  xi: 11, xii: 12, xiii: 13, xiv: 14, xv: 15
};

export function inferCategoryFromWiki(name: string, source: string, desc: string): AccessoryCategory {
  const text = `${name} ${source} ${desc}`.toLowerCase();
  if (text.includes('piggy')) return 'Misc';
  if (/\b(slayer|revenant|tarantula|sven)\b/i.test(text)) return 'Slayer';
  if (/\b(farm\w*|crops?|seeds?|wheat|pumpkins?|sugar\s+cane|potatoes?|carrots?|melons?|cocoa|cactus)\b/i.test(text)) return 'Farming';
  if (/\b(mine|mines|mining|miners?|ores?|ingots?|pickaxes?|drills?)\b/i.test(text)) return 'Mining';
  if (/\b(forag\w*|wood|logs?|logging|trees?|axes?)\b/i.test(text)) return 'Foraging';
  if (/\b(fish\w*|rods?|sea|ocean)\b/i.test(text)) return 'Fishing';
  if (/\b(spooky|jerry|festivals?|events?|candies|candy|pig\s+shop)\b/i.test(text)) return 'Event';
  if (/\b(combat|damage|strength|crits?|swords?|mobs?)\b/i.test(text) && !text.includes('piggy')) return 'Combat';
  return 'Misc';
}

export function inferStageFromWiki(source: string): AccessoryDefinition['stage'] {
  const s = source.toLowerCase();
  if (s.includes('slayer')) return 'Slayer';
  if (s.includes('quest')) return 'Quest';
  if (s.includes('drop') || s.includes('dropped')) return 'Rare Drop';
  if (
    s.includes('julia') ||
    /\bsky\b|\bsky['’]s\b/i.test(s) ||
    s.includes('zoe') ||
    /\b(npc\s+north|adventurer\s+north|north['’]s\s+shop|from\s+north)\b/i.test(s) ||
    s.includes('shop')
  ) {
    return 'NPC Shop';
  }
  if (s.includes('pig shop') || s.includes('event') || s.includes('festival') || s.includes('farm-o-matic')) return 'Event';

  const colMatch = s.match(/collection\s+([0-9]+|[ivx]+)\b/i) || s.match(/\b([ivx]+)\s+collection\b/i);
  if (colMatch) {
    const rawVal = colMatch[1].toLowerCase();
    const level = ROMAN_MAP[rawVal] || parseInt(rawVal, 10) || 0;
    if (level >= 8) return 'High Collection';
    if (level >= 5) return 'Mid Collection';
    if (level >= 1) return 'Early Collection';
  }

  if (s.includes('collection') || s.includes('crafting')) {
    return 'Early Collection';
  }
  return undefined;
}

export function parseWikiPageIntelligence(wikitext: string, pageTitle: string): WikiIntelligenceResult {
  const obtainability = evaluateObtainability({ name: pageTitle, wikitext });

  const categoryMatch = wikitext.match(/\|\s*Category\s*=\s*([^|\n}]+)/i);
  const rawCat = categoryMatch ? categoryMatch[1].trim() : '';

  const sourceMatch = wikitext.match(/(?:^|\n)==\s*Obtaining\s*==\s*([\s\S]*?)(?=(?:\n==[^=])|$)/i);
  const obtainingText = sourceMatch ? sourceMatch[1] : '';

  const category = inferCategoryFromWiki(pageTitle, rawCat, obtainingText);
  const stage = inferStageFromWiki(obtainingText);

  return {
    isObtainable: obtainability.isObtainable,
    status: obtainability.status,
    reason: obtainability.reason,
    category,
    stage
  };
}
