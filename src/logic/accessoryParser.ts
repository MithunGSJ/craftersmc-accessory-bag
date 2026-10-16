import pako from 'pako';
import { NbtReader, NbtCompound } from './nbtReader.ts';
import { PlayerAccessoryItem } from '../data/accessoryTypes.ts';
import { ItemRarity } from '../config/themeConfig.ts';
import { findAccessoryById } from '../data/accessoryRegistry.ts';

export function stripMinecraftCodes(str: string): string {
  return str.replace(/§[0-9a-fk-or]/gi, '').trim();
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
    const itemsList = root['i'] as NbtCompound[] | undefined;
    if (!Array.isArray(itemsList)) return [];

    const result: PlayerAccessoryItem[] = [];

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

      // Determine internal ID
      const internalId = rawId.toUpperCase();
      const catalogEntry = findAccessoryById(internalId);
      const displayName = cleanName || catalogEntry?.name || rawId || 'Unknown Accessory';

      // Determine rarity
      const loreRarity = extractRarityFromLore(cleanLore);
      const rarity: ItemRarity =
        loreRarity || catalogEntry?.baseRarity || 'COMMON';

      // Reforge & enrichment
      const modifier = extraAttrs?.['modifier'] as string | undefined;
      const enrichment = extraAttrs?.['accessory_enrichment'] as string | undefined;

      if (catalogEntry || rawId) {
        result.push({
          id: `${internalId}_${slot}`,
          internalId: internalId || cleanName.toUpperCase().replace(/\s+/g, '_'),
          displayName,
          rarity,
          reforge: modifier ? modifier.charAt(0).toUpperCase() + modifier.slice(1) : undefined,
          enrichment: enrichment ? enrichment.replace(/_/g, ' ') : undefined,
          slot,
          lore: cleanLore
        });
      }
    });

    return result;
  } catch (err) {
    console.error('Failed to parse accessory bag data:', err);
    return [];
  }
}
