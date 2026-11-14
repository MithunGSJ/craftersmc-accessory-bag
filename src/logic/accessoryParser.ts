import pako from 'pako';
import { NbtReader, NbtCompound } from './nbtReader.ts';
import { PlayerAccessoryItem } from '../data/accessoryTypes.ts';
import { ItemRarity } from '../config/themeConfig.ts';
import { findAccessoryById, findAccessoryByName, ACCESSORY_BY_NAME } from '../data/accessoryRegistry.ts';

const REFORGES: readonly string[] = [
  'Pleasant', 'Shaded', 'Silky', 'Sweet', 'Bloody', 'Bountiful', 'Gentle',
  'Odd', 'Fast', 'Fair', 'Epic', 'Sharp', 'Heroic', 'Spicy', 'Legendary',
  'Deadly', 'Fine', 'Grand', 'Hasty', 'Neat', 'Rapid', 'Unreal', 'Awkward',
  'Rich', 'Clean', 'Fierce', 'Heavy', 'Light', 'Mythic', 'Pure', 'Smart',
  'Titanic', 'Wise', 'Bizarre', 'Itchy', 'Ominous', 'Pretty', 'Shiny',
  'Simple', 'Strange', 'Vivid', 'Godly', 'Demonic', 'Forceful', 'Hurtful',
  'Keen', 'Strong', 'Superior', 'Unpleasant', 'Zealous'
];

export function stripMinecraftCodes(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.replace(/§[0-9a-fk-or]/gi, '').trim();
}

const COLOR_TO_RARITY: Record<string, ItemRarity> = {
  f: 'COMMON',
  a: 'UNCOMMON',
  9: 'RARE',
  5: 'EPIC',
  6: 'LEGENDARY',
  d: 'MYTHIC',
  c: 'SPECIAL',
  b: 'VERY_SPECIAL'
};

const RARITY_TIERS: readonly ItemRarity[] = [
  'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC', 'SPECIAL', 'VERY_SPECIAL'
];

function upgradeRarity(rarity: ItemRarity, upgrades: number): ItemRarity {
  const currentIndex = RARITY_TIERS.indexOf(rarity);
  if (currentIndex === -1) return rarity;
  const newIndex = Math.min(currentIndex + upgrades, RARITY_TIERS.length - 1);
  return RARITY_TIERS[newIndex];
}

export function extractRarityFromColorCode(rawName: string): ItemRarity | undefined {
  if (typeof rawName !== 'string') return undefined;
  const matches = rawName.matchAll(/§([0-9a-f])/gi);
  for (const m of matches) {
    const code = m[1].toLowerCase();
    if (COLOR_TO_RARITY[code]) {
      return COLOR_TO_RARITY[code];
    }
  }
  return undefined;
}

const BADGE_REGEX = /\b(VERY\s+SPECIAL|SPECIAL|MYTHIC|LEGENDARY|EPIC|RARE|UNCOMMON|COMMON)\s+(?:DUNGEON\s+)?(?:ACCESSORY|TALISMAN|RING|ARTIFACT|RELIC|HAT|ITEM)\b/i;
const STANDALONE_RARITY_REGEX = /^\s*(VERY\s+SPECIAL|SPECIAL|MYTHIC|LEGENDARY|EPIC|RARE|UNCOMMON|COMMON)\s*$/i;

function toRarity(str: string): ItemRarity | undefined {
  const norm = str.toUpperCase().replace(/\s+/g, '_');
  if (
    norm === 'VERY_SPECIAL' || norm === 'SPECIAL' || norm === 'MYTHIC' ||
    norm === 'LEGENDARY' || norm === 'EPIC' || norm === 'RARE' ||
    norm === 'UNCOMMON' || norm === 'COMMON'
  ) {
    return norm as ItemRarity;
  }
  return undefined;
}

export function extractRarityFromLore(lore: readonly string[]): ItemRarity | undefined {
  if (!Array.isArray(lore)) return undefined;
  for (let i = lore.length - 1; i >= 0; i--) {
    const clean = stripMinecraftCodes(lore[i]);
    const match = clean.match(BADGE_REGEX);
    if (match) {
      const rar = toRarity(match[1]);
      if (rar) return rar;
    }
  }
  for (let i = lore.length - 1; i >= 0; i--) {
    const clean = stripMinecraftCodes(lore[i]);
    const match = clean.match(STANDALONE_RARITY_REGEX);
    if (match) {
      const rar = toRarity(match[1]);
      if (rar) return rar;
    }
  }
  return undefined;
}

export function extractSkullTextureUrl(tag: NbtCompound | undefined): string | undefined {
  if (!tag || typeof tag !== 'object') return undefined;
  const skullOwner = tag['SkullOwner'] as NbtCompound | undefined;
  if (!skullOwner || typeof skullOwner !== 'object') return undefined;

  const properties = skullOwner['Properties'] as NbtCompound | undefined;
  if (!properties || typeof properties !== 'object') return undefined;

  const textures = properties['textures'] as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(textures) || textures.length === 0) return undefined;

  const first = textures[0];
  const value = typeof first?.['Value'] === 'string' ? first['Value'] : undefined;
  if (!value) return undefined;

  try {
    const decoded = atob(value);
    const parsed = JSON.parse(decoded);
    const skinUrl = parsed?.textures?.SKIN?.url;
    if (typeof skinUrl === 'string' && skinUrl.startsWith('http')) {
      return skinUrl.replace(/^http:\/\//i, 'https://');
    }
  } catch {
    // Ignore invalid JSON / base64
  }
  return undefined;
}

export function parseAccessoryBagBase64(base64Data: string): PlayerAccessoryItem[] {
  if (!base64Data || base64Data.trim() === '') return [];

  try {
    const binaryString = atob(base64Data.trim());
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Check gzip magic bytes (0x1f, 0x8b)
    const decompressed =
      bytes.length > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b
        ? pako.ungzip(bytes)
        : bytes;

    const reader = new NbtReader(decompressed);
    const root = reader.readRoot();
    const result: PlayerAccessoryItem[] = [];

    // Format 1: CraftersMC native format (root.items array)
    const craftersItems = root['items'] as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(craftersItems) && craftersItems.length > 0) {
      craftersItems.forEach((item, index) => {
        if (!item || typeof item !== 'object') return;
        const rawName = String(item['name'] || '');
        const cleanAll = stripMinecraftCodes(rawName);
        if (!cleanAll) return;

        let reforge: string | undefined;
        let cleanBaseName = cleanAll;

        const exactNorm = cleanAll.toLowerCase().replace(/[^a-z0-9]/g, '');
        const exactCatalogItem = ACCESSORY_BY_NAME.get(exactNorm);

        if (!exactCatalogItem) {
          for (const ref of REFORGES) {
            if (cleanAll.startsWith(`${ref} `)) {
              const candidate = cleanAll.slice(ref.length + 1).trim();
              if (findAccessoryByName(candidate)) {
                reforge = ref;
                cleanBaseName = candidate;
                break;
              }
            }
          }
        }

        const catalogEntry = exactCatalogItem || findAccessoryByName(cleanBaseName) || findAccessoryByName(cleanAll);
        const internalId = catalogEntry?.id || cleanBaseName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        const displayName = catalogEntry?.name || cleanBaseName;
        const rawSlot = item['slot'];
        const slot =
          typeof rawSlot === 'number' && Number.isFinite(rawSlot)
            ? rawSlot
            : typeof rawSlot === 'string' && Number.isFinite(parseInt(rawSlot, 10))
            ? parseInt(rawSlot, 10)
            : index;
        const rarity = extractRarityFromColorCode(rawName) || catalogEntry?.baseRarity || 'COMMON';

        const skinUrl =
          (typeof item['skinUrl'] === 'string' ? item['skinUrl'] : undefined) ||
          (typeof item['texture'] === 'string' && item['texture'].startsWith('http') ? item['texture'] : undefined) ||
          extractSkullTextureUrl(item['tag'] as NbtCompound | undefined);

        result.push({
          id: `${internalId}_${slot}`,
          internalId,
          displayName,
          rarity,
          reforge,
          slot,
          lore: catalogEntry?.loreLines || [displayName],
          skinUrl,
          isUncataloged: !catalogEntry
        });
      });
      return result;
    }

    // Format 2: Hypixel / Standard NBT format (root.i list of items)
    const itemsList = root['i'] as NbtCompound[] | undefined;
    if (Array.isArray(itemsList)) {
      itemsList.forEach((item, slot) => {
        if (!item || typeof item !== 'object') return;
        const tag = item['tag'] as NbtCompound | undefined;
        if (!tag) return;

        const extraAttrs = tag['ExtraAttributes'] as NbtCompound | undefined;
        const display = tag['display'] as NbtCompound | undefined;

        const rawId = (extraAttrs?.['id'] as string) || '';
        const rawName = (display?.['Name'] as string) || '';
        const rawLore = (display?.['Lore'] as string[]) || [];

        const cleanName = stripMinecraftCodes(rawName);
        const cleanLore = Array.isArray(rawLore)
          ? rawLore.map(line => stripMinecraftCodes(String(line)))
          : [];

        const internalId = rawId.toUpperCase();
        const catalogEntry = findAccessoryById(internalId) || findAccessoryByName(cleanName);
        const displayName = catalogEntry?.name || cleanName || rawId || 'Unknown Accessory';
        const loreRarity = extractRarityFromLore(cleanLore);

        const modifier = extraAttrs?.['modifier'] as string | undefined;
        const enrichment = extraAttrs?.['accessory_enrichment'] as string | undefined;
        const skinUrl = extractSkullTextureUrl(tag);

        const effectiveInternalId = internalId || cleanName.toUpperCase().replace(/\s+/g, '_') || 'UNKNOWN';
        const rawSlot = item['Slot'] ?? item['slot'];
        let trueSlot = slot;
        if (typeof rawSlot === 'number' && Number.isFinite(rawSlot)) {
          trueSlot = rawSlot;
        } else if (typeof rawSlot === 'string') {
          const parsed = parseInt(rawSlot, 10);
          if (Number.isFinite(parsed)) trueSlot = parsed;
        }

        const isAccessory = Boolean(
          catalogEntry ||
          cleanLore.some(line => BADGE_REGEX.test(line)) ||
          /\b(TALISMAN|RING|ARTIFACT|RELIC|ACCESSORY)\b/i.test(cleanName) ||
          /(?:_|\b)(TALISMAN|RING|ARTIFACT|RELIC|ACCESSORY)(?:_|\b)/i.test(effectiveInternalId)
        );

        if (isAccessory && (catalogEntry || rawId || cleanName)) {
          const rarityUpgrades = typeof extraAttrs?.['rarity_upgrades'] === 'number'
            ? extraAttrs['rarity_upgrades']
            : 0;
          const base = loreRarity || catalogEntry?.baseRarity || extractRarityFromColorCode(rawName) || 'COMMON';
          const rarity: ItemRarity = !loreRarity && rarityUpgrades > 0 ? upgradeRarity(base, rarityUpgrades) : base;

          result.push({
            id: `${effectiveInternalId}_${trueSlot}`,
            internalId: effectiveInternalId,
            displayName,
            rarity,
            reforge: modifier ? modifier.charAt(0).toUpperCase() + modifier.slice(1) : undefined,
            enrichment: enrichment ? enrichment.replace(/_/g, ' ') : undefined,
            slot: trueSlot,
            lore: cleanLore,
            skinUrl,
            isUncataloged: !catalogEntry
          });
        }
      });
    }

    return result;
  } catch (err) {
    console.error('Failed to parse accessory bag data:', err);
    return [];
  }
}
