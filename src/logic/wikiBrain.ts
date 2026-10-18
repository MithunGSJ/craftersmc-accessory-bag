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

export function inferCategoryFromWiki(name: string, source: string, desc: string): AccessoryCategory {
  const text = `${name} ${source} ${desc}`.toLowerCase();
  if (text.includes('slayer') || text.includes('revenant') || text.includes('tarantula') || text.includes('sven')) return 'Slayer';
  if (text.includes('farm') || text.includes('crop') || text.includes('seed') || text.includes('wheat') || text.includes('pumpkin') || text.includes('sugar cane') || text.includes('potato') || text.includes('carrot') || text.includes('melon') || text.includes('cocoa') || text.includes('cactus')) return 'Farming';
  if (text.includes('mine') || text.includes('ore') || text.includes('ingot') || text.includes('pickaxe') || text.includes('drill')) return 'Mining';
  if (text.includes('forag') || text.includes('wood') || text.includes('log') || text.includes('tree') || text.includes('axe')) return 'Foraging';
  if (text.includes('fish') || text.includes('rod') || text.includes('sea') || text.includes('ocean')) return 'Fishing';
  if (text.includes('spooky') || text.includes('jerry') || text.includes('festival') || text.includes('event') || text.includes('candy') || text.includes('pig shop')) return 'Event';
  if (text.includes('combat') || text.includes('damage') || text.includes('strength') || text.includes('crit') || text.includes('sword') || text.includes('mob')) return 'Combat';
  return 'Misc';
}

export function inferStageFromWiki(source: string): AccessoryDefinition['stage'] {
  const s = source.toLowerCase();
  if (s.includes('slayer')) return 'Slayer';
  if (s.includes('quest')) return 'Quest';
  if (s.includes('drop') || s.includes('dropped')) return 'Rare Drop';
  if (s.includes('julia') || s.includes('sky') || s.includes('zoe') || s.includes('north') || s.includes('shop')) return 'NPC Shop';
  if (s.includes('pig shop') || s.includes('event') || s.includes('festival') || s.includes('farm-o-matic')) return 'Event';
  if (s.includes('collection 8') || s.includes('collection 9') || s.includes('collection 10') || s.includes('collection 11') || s.includes('collection 12') || s.includes('collection 13') || s.includes('collection 14')) {
    return 'High Collection';
  }
  if (s.includes('collection 5') || s.includes('collection 6') || s.includes('collection 7')) {
    return 'Mid Collection';
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

  const sourceMatch = wikitext.match(/==\s*Obtaining\s*==\s*([\s\S]*?)(?:==|$)/i);
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
