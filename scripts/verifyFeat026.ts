import fs from 'fs';
import { extractSkullTextureUrl } from '../src/logic/accessoryParser.ts';
import { evaluatePlayerAccessories } from '../src/logic/accessoryMatcher.ts';
import { PlayerAccessoryItem } from '../src/data/accessoryTypes.ts';

const rawSkin = JSON.stringify({
  textures: {
    SKIN: {
      url: 'http://textures.minecraft.net/texture/3f4e8b3b723547ec94589255a8220f8c87ab56f3458cf5f5904571f5a5e3f'
    }
  }
});
const mockTag = {
  SkullOwner: {
    Properties: {
      textures: [{ Value: Buffer.from(rawSkin).toString('base64') }]
    }
  }
};
const skinUrl = extractSkullTextureUrl(mockTag);

const zeroDayItem: PlayerAccessoryItem = {
  id: 'ANCIENT_DIVINE_RELIC_0',
  internalId: 'ANCIENT_DIVINE_RELIC',
  displayName: 'Ancient Divine Relic',
  rarity: 'SPECIAL',
  slot: 12,
  lore: ['An unreleased mythological artifact.'],
  skinUrl,
  isUncataloged: true
};

const evaluated = evaluatePlayerAccessories([zeroDayItem]);
const uncataloged = evaluated.find(e => e.definition.id === 'ANCIENT_DIVINE_RELIC');

const evidence = {
  extractedSkinUrl: skinUrl,
  evaluatedUncataloged: uncataloged
};

if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
fs.writeFileSync('tmp/evidence_feat_026_skull_and_uncataloged.json', JSON.stringify(evidence, null, 2));
console.log('Successfully generated tmp/evidence_feat_026_skull_and_uncataloged.json');
