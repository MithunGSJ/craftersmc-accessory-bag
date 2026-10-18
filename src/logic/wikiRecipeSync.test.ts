import { describe, it, expect } from 'vitest';
import { extractTemplateBlocks, parseCraftTemplate } from '../../scripts/extractWikiRecipes.ts';
import { ACCESSORY_RECIPES } from '../data/accessoryRecipes.ts';
import { ALL_ACCESSORIES, findAccessoryById } from '../data/accessoryRegistry.ts';
import { getWikiSyncStatus } from '../server/wikiSyncWorker.ts';

describe('Wiki Recipe Extraction & Synchronization', () => {
  it('extracts balanced {{Craft}} templates with nested {{Slot}} templates', () => {
    const sampleWikitext = `
== Obtaining ==
{{Craft
|A1={{Slot|Sugar Cane|12}}|A2={{Slot|Sugar Cane|12}}|A3={{Slot|Sugar Cane|12}}
|B1={{Slot|Sugar Cane|12}}|B2={{Slot|Air}}|B3={{Slot|Sugar Cane|12}}
|C1={{Slot|Sugar Cane|12}}|C2={{Slot|Sugar Cane|12}}|C3={{Slot|Sugar Cane|12}}
|Result={{Slot|Speed Talisman}}
}}
Some other text {{AnotherTemplate|val=1}}
`;

    const blocks = extractTemplateBlocks(sampleWikitext, 'Craft');
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toContain('Result={{Slot|Speed Talisman}}');
  });

  it('correctly parses recipe ingredients and target name from Craft template', () => {
    const craftBlock = `{{Craft
|A1={{Slot|Poisonous Potato|1}}|A2={{Slot|Poisonous Potato|1}}|A3={{Slot|Poisonous Potato|1}}
|B1={{Slot|Poisonous Potato|1}}|B2={{Slot|Poisonous Potato|1}}|B3={{Slot|Poisonous Potato|1}}
|C1={{Slot|Poisonous Potato|1}}|C2={{Slot|Poisonous Potato|1}}|C3={{Slot|Poisonous Potato|1}}
|Result={{Slot|Vaccine Talisman}}
}}`;

    const parsed = parseCraftTemplate(craftBlock);
    expect(parsed).not.toBeNull();
    expect(parsed?.targetId).toBe('VACCINE_TALISMAN');
    expect(parsed?.targetName).toBe('Vaccine Talisman');
    expect(parsed?.ingredients).toHaveLength(1);
    expect(parsed?.ingredients[0].itemId).toBe('poisonous_potato');
    expect(parsed?.ingredients[0].count).toBe(9);
  });

  it('correctly detects upgradesFrom accessory in Craft template', () => {
    const craftBlock = `{{Craft
|A1={{Slot|Air}}|A2={{Slot|Enchanted Sugar|32}}|A3={{Slot|Air}}
|B1={{Slot|Enchanted Sugar|32}}|B2={{Slot|Speed Talisman}}|B3={{Slot|Enchanted Sugar|32}}
|C1={{Slot|Air}}|C2={{Slot|Air}}|C3={{Slot|Air}}
|Result={{Slot|Speed Ring}}
}}`;

    const parsed = parseCraftTemplate(craftBlock);
    expect(parsed).not.toBeNull();
    expect(parsed?.targetId).toBe('SPEED_RING');
    expect(parsed?.upgradesFrom).toBe('SPEED_TALISMAN');
    expect(parsed?.ingredients).toHaveLength(1);
    expect(parsed?.ingredients[0].itemId).toBe('enchanted_sugar');
    expect(parsed?.ingredients[0].count).toBe(96);
  });

  it('merges scraped wiki recipes into ACCESSORY_RECIPES dynamically', () => {
    expect(ACCESSORY_RECIPES['SPEED_TALISMAN']).toBeDefined();
    expect(ACCESSORY_RECIPES['SPEED_RING']).toBeDefined();
    expect(ACCESSORY_RECIPES['DRACONIC_ARTIFACT']).toBeDefined();
    expect(ACCESSORY_RECIPES['BAMBOO_RING']).toBeDefined();
    expect(Object.keys(ACCESSORY_RECIPES).length).toBeGreaterThan(40);
  });

  it('incorporates dynamic wiki accessories into ALL_ACCESSORIES registry', () => {
    expect(ALL_ACCESSORIES.length).toBeGreaterThanOrEqual(77);
    const speed = findAccessoryById('SPEED_TALISMAN');
    expect(speed).toBeDefined();
    expect(speed?.baseRarity).toBe('COMMON');

    // Verify all accessories have valid properties
    for (const acc of ALL_ACCESSORIES) {
      expect(acc.id).toBeTruthy();
      expect(acc.name).toBeTruthy();
      expect(acc.baseRarity).toBeTruthy();
      expect(acc.category).toBeTruthy();
      expect(acc.tier).toBeGreaterThanOrEqual(1);
      expect(acc.loreLines).toBeInstanceOf(Array);
    }
  });

  it('reports active 30-minute wiki sync status', () => {
    const status = getWikiSyncStatus();
    expect(status.intervalMinutes).toBe(30);
    expect(status.nextSyncTime).toBeGreaterThan(Date.now() - 1000);
    expect(status.totalAccessories).toBeGreaterThanOrEqual(70);
    expect(status.totalRecipes).toBeGreaterThanOrEqual(30);
  });
});
