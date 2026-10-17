import pako from 'pako';
import { NbtReader, NbtCompound } from './nbtReader.ts';
import { PlayerAccessoryItem } from '../data/accessoryTypes.ts';
import { ItemRarity } from '../config/themeConfig.ts';
import { findAccessoryById, findAccessoryByName } from '../data/accessoryRegistry.ts';

const REFORGES: readonly string[] = [
  'Pleasant', 'Shaded', 'Silky', 'Sweet', 'Bloody', 'Bountiful', 'Gentle',
  'Odd', 'Fast', 'Fair', 'Epic', 'Sharp', 'Heroic', 'Spicy', 'Legendary',
  'Deadly', 'Fine', 'Grand', 'Hasty', 'Neat', 'Rapid', 'Unreal', 'Awkward',
  'Rich', 'Clean', 'Fierce', 'Heavy', 'Light', 'Mythic', 'Pure', 'Smart',
  'Titanic', 'Wise', 'Bizarre', 'Itchy', 'Ominous', 'Pretty', 'Shiny',
  'Simple', 'Strange', 'Vivid', 'Godly', 'Demonic', 'Forceful', 'Hurtful',
  'Keen', 'Strong', 'Superior', 'Unpleasant', 'Zealous'
];

export function stripMinecraftCodes(str: string): string {
  return str.replace(/§[0-9a-fk-or]/gi, '').trim();
}

export function extractRarityFromColorCode(rawName: string): ItemRarity | undefined {
  if (rawName.includes('§f')) return 'COMMON';
  if (rawName.includes('§a')) return 'UNCOMMON';
  if (rawName.includes('§9') || rawName.includes('§n')) return 'RARE';
  if (rawName.includes('§5')) return 'EPIC';
  if (rawName.includes('§6')) return 'LEGENDARY';
  if (rawName.includes('§d')) return 'MYTHIC';
  if (rawName.includes('§c')) return 'SPECIAL';
  if (rawName.includes('§b')) return 'VERY_SPECIAL';
  return undefined;
}

export function extractRarityFromLore(lore: readonly string[]): ItemRarity | undefined {
  for (let i = lore.length - 1; i >= 0; i--) {
    const clean = stripMinecraftCodes(lore[i]).toUpperCase();
    if (clean.includes('VERY SPECIAL')) return 'VERY_SPECIAL';
    if (clean.includes('SPECIAL')) return 'SPECIAL';
    if (clean.includes('MYTHIC')) return 'MYTHIC';
    if (clean.includes('LEGENDARY')) return 'LEGENDARY';
    if (clean.includes('EPIC')) return 'EPIC';
    if (clean.includes('RARE')) return 'RARE';
    if (clean.includes('UNCOMMON')) return 'UNCOMMON';
    if (clean.includes('COMMON')) return 'COMMON';
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

        for (const ref of REFORGES) {
          if (cleanAll.startsWith(`${ref} `)) {
            reforge = ref;
            cleanBaseName = cleanAll.slice(ref.length + 1).trim();
            break;
          }
        }

        const catalogEntry = findAccessoryByName(cleanBaseName) || findAccessoryByName(cleanAll);
        const internalId = catalogEntry?.id || cleanBaseName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        const displayName = catalogEntry?.name || cleanBaseName;
        const slot = typeof item['slot'] === 'number' ? item['slot'] : index;
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
        const rarity: ItemRarity = loreRarity || catalogEntry?.baseRarity || 'COMMON';

        const modifier = extraAttrs?.['modifier'] as string | undefined;
        const enrichment = extraAttrs?.['accessory_enrichment'] as string | undefined;
        const skinUrl = extractSkullTextureUrl(tag);

        if (catalogEntry || rawId || cleanName) {
          result.push({
            id: `${internalId}_${slot}`,
            internalId: internalId || cleanName.toUpperCase().replace(/\s+/g, '_'),
            displayName,
            rarity,
            reforge: modifier ? modifier.charAt(0).toUpperCase() + modifier.slice(1) : undefined,
            enrichment: enrichment ? enrichment.replace(/_/g, ' ') : undefined,
            slot,
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
