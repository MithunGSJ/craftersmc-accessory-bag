import { describe, it, expect } from 'vitest';
import { evaluateObtainability, isObtainableAccessory, parseWikiPageIntelligence } from './wikiBrain.ts';

describe('WikiBrain Intelligence Engine', () => {
  it('correctly identifies Acacia Stop as admin-only and unobtainable', () => {
    const res = evaluateObtainability({
      name: 'Acacia Stop',
      source: 'Admin-only',
      wikitext: '{{Infobox item|Name=Acacia Stop}}{{Ambox admin}}'
    });
    expect(res.isObtainable).toBe(false);
    expect(res.status).toBe('ADMIN_ONLY');
    expect(isObtainableAccessory({ name: 'Acacia Stop', source: 'Admin-only' })).toBe(false);
  });

  it('correctly identifies Beta Fish, Filthy Rich Talisman, and Mini Fairy as removed', () => {
    const beta = evaluateObtainability({
      name: 'Beta Fish',
      source: 'Removed',
      wikitext: '{{Ambox removed}}\n{{Item|Beta Fish}} was a Special accessory.'
    });
    expect(beta.isObtainable).toBe(false);
    expect(beta.status).toBe('REMOVED');

    const filthy = evaluateObtainability({
      name: 'Filthy Rich Talisman',
      source: 'Removed',
      wikitext: '{{Ambox removed}}'
    });
    expect(filthy.isObtainable).toBe(false);
    expect(filthy.status).toBe('REMOVED');

    const fairy = evaluateObtainability({
      name: 'Mini Fairy',
      source: 'Removed',
      wikitext: '{{Ambox removed}}'
    });
    expect(fairy.isObtainable).toBe(false);
    expect(fairy.status).toBe('REMOVED');
  });

  it('correctly identifies Magical Encyclopedia, Creative Mind, and Game Breaker as unobtainable', () => {
    const mag = evaluateObtainability({
      name: 'Magical Encyclopedia',
      source: 'Unobtainable'
    });
    expect(mag.isObtainable).toBe(false);
    expect(mag.status).toBe('UNOBTAINABLE');

    const creative = evaluateObtainability({
      name: 'Creative Mind',
      description: 'This item was awarded to [player] for presenting a creative idea that has been added to SkyBlock.'
    });
    expect(creative.isObtainable).toBe(false);
    expect(creative.status).toBe('UNOBTAINABLE');

    const breaker = evaluateObtainability({
      name: 'Game Breaker',
      description: 'This item was awarded to [player] for reporting a bug that could break the game.'
    });
    expect(breaker.isObtainable).toBe(false);
    expect(breaker.status).toBe('UNOBTAINABLE');
  });

  it('correctly verifies standard obtainable accessories as OBTAINABLE', () => {
    expect(isObtainableAccessory({ name: 'Speed Talisman', source: 'Crafting ( Sugar Cane 2)' })).toBe(true);
    expect(isObtainableAccessory({ name: 'Zombie Ring', source: 'Crafting ( Zombie Slayer 2)' })).toBe(true);
    expect(isObtainableAccessory({ name: 'Cake Slice', source: '"Half-Baked Duo" quest' })).toBe(true);
    expect(isObtainableAccessory({ name: 'Blood God Crest', source: 'Pig Shop' })).toBe(true);
    expect(isObtainableAccessory({ name: 'Coins Talisman', source: 'Crafting ( Emerald 2)' })).toBe(true);
    expect(isObtainableAccessory({ name: 'Draconic Artifact', source: 'Crafting' })).toBe(true);
  });

  it('parses full wiki page intelligence accurately', () => {
    const wikitext = `
{{Infobox item
| Name = Speed Talisman
| Category = Accessory
| Rarity = Common
}}
== Obtaining ==
Unlocked at Sugar Cane collection II.
Crafted using 108 Sugar Cane.
`;
    const intel = parseWikiPageIntelligence(wikitext, 'Speed Talisman');
    expect(intel.isObtainable).toBe(true);
    expect(intel.status).toBe('OBTAINABLE');
    expect(intel.category).toBe('Farming');
  });
});
