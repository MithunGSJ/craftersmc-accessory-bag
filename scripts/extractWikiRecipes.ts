export interface ScrapedRecipeIngredient {
  readonly itemId: string;
  readonly name: string;
  readonly count: number;
}

export interface ScrapedAccessoryRecipe {
  readonly targetId: string;
  readonly targetName: string;
  readonly upgradesFrom?: string;
  readonly ingredients: readonly ScrapedRecipeIngredient[];
}

export function extractTemplateBlocks(wikitext: string, templateName: string): string[] {
  const startTag = `{{${templateName}`;
  let pos = 0;
  const templates: string[] = [];

  while ((pos = wikitext.indexOf(startTag, pos)) !== -1) {
    let depth = 2;
    let i = pos + startTag.length;
    while (i < wikitext.length && depth > 0) {
      if (wikitext[i] === '{' && wikitext[i + 1] === '{') {
        depth += 2;
        i += 2;
      } else if (wikitext[i] === '}' && wikitext[i + 1] === '}') {
        depth -= 2;
        i += 2;
      } else {
        i++;
      }
    }
    templates.push(wikitext.slice(pos, i));
    pos = i;
  }

  return templates;
}

export function parseCraftTemplate(craftText: string, expectedName?: string): ScrapedAccessoryRecipe | null {
  const resultMatch = craftText.match(/\|\s*Result\s*=\s*\{\{Slot\|([^|}]+)/i);
  if (!resultMatch && !expectedName) return null;

  const targetName = (resultMatch ? resultMatch[1] : expectedName || '').trim();
  const targetId = targetName.toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  if (!targetId) return null;

  const slotRegex = /\|\s*[A-C][1-3]\s*=\s*\{\{Slot\|([^|}]+)(?:\|(\d+))?\}\}/gi;
  let match: RegExpExecArray | null;
  const ingredientsMap: Record<string, { itemId: string; name: string; count: number }> = {};
  let upgradesFrom: string | undefined;

  while ((match = slotRegex.exec(craftText)) !== null) {
    const rawName = match[1].trim();
    if (rawName.toLowerCase() === 'air' || !rawName) continue;
    const count = parseInt(match[2] || '1', 10);
    const rawId = rawName.toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');

    // Check if slot represents an earlier tier accessory (e.g. Ring upgrades from Talisman)
    const isAccessory = rawName.toLowerCase().includes('talisman') ||
                        rawName.toLowerCase().includes('ring') ||
                        rawName.toLowerCase().includes('artifact') ||
                        rawName.toLowerCase().includes('orb');

    if (isAccessory && rawId !== targetId) {
      if (!upgradesFrom) {
        upgradesFrom = rawId;
        continue;
      }
    }

    const itemId = rawName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    if (!ingredientsMap[itemId]) {
      ingredientsMap[itemId] = { itemId, name: rawName, count: 0 };
    }
    ingredientsMap[itemId].count += count;
  }

  const ingredients = Object.values(ingredientsMap);
  if (ingredients.length === 0 && !upgradesFrom) return null;

  return {
    targetId,
    targetName,
    upgradesFrom,
    ingredients
  };
}

export async function fetchPageWikitext(pageTitle: string): Promise<string> {
  const url = `https://craftersmc.wiki.gg/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=wikitext&format=json`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'CraftersMC-RecipeScraper/1.0' },
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) return '';
    const data = await res.json() as { parse?: { wikitext?: { '*'?: string } } };
    return data.parse?.wikitext?.['*'] || '';
  } catch {
    return '';
  }
}

export async function extractRecipesForAccessory(pageTitle: string): Promise<ScrapedAccessoryRecipe[]> {
  const wikitext = await fetchPageWikitext(pageTitle);
  if (!wikitext) return [];

  const craftBlocks = extractTemplateBlocks(wikitext, 'Craft');
  const recipes: ScrapedAccessoryRecipe[] = [];

  for (const block of craftBlocks) {
    const parsed = parseCraftTemplate(block, pageTitle.replace(/_/g, ' '));
    if (parsed) {
      recipes.push(parsed);
    }
  }

  return recipes;
}
