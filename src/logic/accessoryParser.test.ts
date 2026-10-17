import { describe, it, expect } from 'vitest';
import pako from 'pako';
import {
  stripMinecraftCodes,
  extractRarityFromLore,
  parseAccessoryBagBase64,
  extractSkullTextureUrl
} from './accessoryParser.ts';

describe('accessoryParser', () => {
  it('should strip Minecraft color and style formatting codes correctly', () => {
    const raw = '§aZombie §6Ring §r§7(+5% Defense)';
    expect(stripMinecraftCodes(raw)).toBe('Zombie Ring (+5% Defense)');
  });

  it('should extract correct rarity from lore lines', () => {
    const lore = [
      '§7Reduce damage taken from',
      '§7Zombies by 15%.',
      '§r',
      '§6§lLEGENDARY ACCESSORY'
    ];
    expect(extractRarityFromLore(lore)).toBe('LEGENDARY');
  });

  it('should return empty array for empty or whitespace base64 input', () => {
    expect(parseAccessoryBagBase64('')).toEqual([]);
    expect(parseAccessoryBagBase64('   ')).toEqual([]);
  });

  it('should parse gzipped NBT data into structured player accessories', () => {
    // Construct a minimal valid NBT buffer for an inventory with 1 item
    // TAG_Compound "" -> TAG_List "i" of TAG_Compound -> TAG_Compound with ExtraAttributes { id: "ZOMBIE_RING" }
    // We can write a quick binary buffer:
    const buf: number[] = [];
    // TAG_Compound (10), name ""
    buf.push(10, 0, 0);
    // TAG_List (9), name "i" (len 1)
    buf.push(9, 0, 1, 'i'.charCodeAt(0));
    // list type = TAG_Compound (10), length = 1
    buf.push(10, 0, 0, 0, 1);
    // inside item 0:
    // TAG_Compound (10), name "tag" (len 3)
    buf.push(10, 0, 3, ...'tag'.split('').map(c => c.charCodeAt(0)));
    // inside tag:
    // TAG_Compound (10), name "ExtraAttributes" (len 15)
    const extra = 'ExtraAttributes';
    buf.push(10, 0, extra.length, ...extra.split('').map(c => c.charCodeAt(0)));
    // inside ExtraAttributes:
    // TAG_String (8), name "id" (len 2), value "ZOMBIE_RING" (len 11)
    const itemId = 'ZOMBIE_RING';
    buf.push(8, 0, 2, 'i'.charCodeAt(0), 'd'.charCodeAt(0));
    buf.push(0, itemId.length, ...itemId.split('').map(c => c.charCodeAt(0)));
    // TAG_End (0) for ExtraAttributes
    buf.push(0);
    // TAG_End (0) for tag
    buf.push(0);
    // TAG_End (0) for item 0
    buf.push(0);
    // TAG_End (0) for root compound
    buf.push(0);

    const compressed = pako.gzip(new Uint8Array(buf));
    let binary = '';
    for (let i = 0; i < compressed.length; i++) {
      binary += String.fromCharCode(compressed[i]);
    }
    const b64 = btoa(binary);

    const parsed = parseAccessoryBagBase64(b64);
    expect(parsed.length).toBe(1);
    expect(parsed[0].internalId).toBe('ZOMBIE_RING');
    expect(parsed[0].displayName).toBe('Zombie Ring');
    expect(parsed[0].rarity).toBe('UNCOMMON');
  });

  it('should parse CraftersMC native items format with reforge extraction', () => {
    // Construct NBT with root compound -> "items" list of compounds with "name" = "§r§6Pleasant Personal Compactor 7000"
    const buf: number[] = [];
    buf.push(10, 0, 0); // root compound ""
    buf.push(9, 0, 5, ...'items'.split('').map(c => c.charCodeAt(0))); // list "items"
    buf.push(10, 0, 0, 0, 1); // 1 compound
    // item 0: TAG_String "name" = "§r§6Pleasant Personal Compactor 7000"
    const itemName = '§r§6Pleasant Personal Compactor 7000';
    const nameBytes = new TextEncoder().encode(itemName);
    buf.push(8, 0, 4, ...'name'.split('').map(c => c.charCodeAt(0)));
    buf.push(0, nameBytes.length, ...nameBytes);
    buf.push(0); // end item 0
    buf.push(0); // end root

    const compressed = pako.gzip(new Uint8Array(buf));
    let binary = '';
    for (let i = 0; i < compressed.length; i++) {
      binary += String.fromCharCode(compressed[i]);
    }
    const b64 = btoa(binary);

    const parsed = parseAccessoryBagBase64(b64);
    expect(parsed.length).toBe(1);
    expect(parsed[0].displayName).toBe('Personal Compactor 7000');
    expect(parsed[0].reforge).toBe('Pleasant');
    expect(parsed[0].rarity).toBe('LEGENDARY');
  });

  it('extracts direct Mojang skin texture URL from SkullOwner NBT compound', () => {
    const rawSkinJson = JSON.stringify({
      textures: {
        SKIN: {
          url: 'http://textures.minecraft.net/texture/3f4e8b3b723547ec94589255a8220f8c87ab56f3458cf5f5904571f5a5e3f'
        }
      }
    });
    const base64Value = btoa(rawSkinJson);

    const mockTag = {
      SkullOwner: {
        Properties: {
          textures: [
            {
              Value: base64Value
            }
          ]
        }
      }
    };

    const url = extractSkullTextureUrl(mockTag);
    expect(url).toBe('https://textures.minecraft.net/texture/3f4e8b3b723547ec94589255a8220f8c87ab56f3458cf5f5904571f5a5e3f');
  });

  it('gracefully handles missing, empty, or corrupted SkullOwner NBT tags', () => {
    expect(extractSkullTextureUrl(undefined)).toBeUndefined();
    expect(extractSkullTextureUrl({})).toBeUndefined();
    expect(extractSkullTextureUrl({ SkullOwner: {} })).toBeUndefined();
    expect(extractSkullTextureUrl({ SkullOwner: { Properties: { textures: [] } } })).toBeUndefined();
    expect(extractSkullTextureUrl({ SkullOwner: { Properties: { textures: [{ Value: 'invalid-b64-json' }] } } })).toBeUndefined();
  });
});

