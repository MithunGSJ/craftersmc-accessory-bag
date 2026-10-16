# Project Progress: CraftersMC SkyBlock Accessory Bag Web App

## Current Phase

Completed (FEAT-015: Verified Accessory Hierarchy & Recipes, Thaumaturgy 5 MP, Pig's Foot Icon, and Minecraft Inventory NBT Slot Order Layout)

## What Changed Last

- **Corrected Accessory Hierarchies (FEAT-015)**:
  - `Fire Talisman`: Standalone Common fire immunity accessory (family `fire_talisman`, tier 1). Not connected to Fire Extinguisher.
  - `Fire Devourer`: Corrected to be tier 2 upgrade of `Fire Extinguisher` (family `fire_extinguisher`, tier 1 = Extinguisher, tier 2 = Devourer).
  - `Frostclaw Relic`: Set as tier 4 upgrade of `Red Claw Artifact` (family `red_claw`, tier 4), not Hunter Ring.
  - `Hunter Ring`: Separated into standalone 2-tier wolf slayer family (`hunter`, tier 1 = Hunter Talisman, tier 2 = Hunter Ring).
  - `Reaper Orb`: Standalone Legendary zombie slayer item (family `reaper_orb`, tier 1); not an upgrade for Zombie Artifact.
  - `Zombie Artifact`: Tier 3 max tier of Zombie slayer family (`zombie`).
- **Verified Wiki Crafting Recipes from craftersmc.wiki.gg**:
  - `Fire Extinguisher`: 8x Envoy's Horn (`envoys_horn`, 28,175 coins/ea).
  - `Fire Devourer`: 1x Fire Extinguisher + 4x Fire Fragment (`fire_fragment`, 70,400 coins/ea). Removed blaze rods.
  - `Frostclaw Relic`: 1x Red Claw Artifact + 64x Glacial Fang (`glacial_fang`, 550,000 coins/ea) + 128x Enchanted Packed Ice (`enchanted_packed_ice`, 625,000 coins/ea).
  - `Hunter Ring`: 1x Hunter Talisman + 1x Grizzly Bait (`grizzly_bait`, 1.93M/ea) + 224x Golden Tooth.
  - `Hunter Talisman`: 64x Golden Tooth + 32x Enchanted Rotten Flesh.
  - `Reaper Orb`: 8x Scythe Blade (`scythe_blade`, 41M/ea).
  - `Zombie Artifact`: 1x Zombie Ring + 48x Revenant Viscera + 32x Enchanted Iron Ingot + 16x Enchanted Diamond.
  - `Red Claw Ring`: 1x Red Claw Talisman + 8x Golden Tooth + 32x Enchanted Leather.
  - `Red Claw Artifact`: 1x Red Claw Ring + 1x Red Claw Egg + 54x Golden Tooth + 128x Enchanted Leather.
  - `Wolf Ring`: 1x Wolf Talisman + 1x Weak Wolf Catalyst + 14x Enchanted Bone.
  - `Fermento Artifact`: 1x Squash Ring + 8x Condensed Fermento.
  - `Draconic Talisman`: 2x Fused Remnants + 96x Mite Gel + 32x Absolute Ender Pearl.
  - `Draconic Ring`: 1x Draconic Talisman + 4x Fused Remnants + 96x Mite Gel + 1x Tessellated Ender Pearl.
  - `Draconic Artifact`: 1x Draconic Ring + 12x Fused Remnants + 128x Mite Gel + 2x Tessellated Ender Pearl.
  - `Lava Talisman`: 9x Enchanted Magma Cream.
  - `Night Vision Charm`: 4x Enchanted Red Mushroom + 4x Enchanted Brown Mushroom.
- **Thaumaturgy Magical Power Alignment**:
  - Aligned with <https://craftersmc.wiki.gg/wiki/Thaumaturgy#Magical_Power>: Special rarity accessories grant 5 MP (previously 3 MP in themeConfig.ts).
- **Pig's Foot Icon Fix**:
  - Downloaded valid PNG sprite to `public/icons/accessories/pigs_foot.png`, `pig_foot.png`, `pig_s_foot.png`.
  - Added robust filename normalization in `AccessoryIcon.tsx`.
  - Verified in browser with 64x64 natural dimensions rendering the actual icon.
- **Minecraft Inventory View Alignment**:
  - Chest GUI slots only display OWNED accessories sorted strictly in NBT line-up bag slot index order (`ownedItem.slot`).
  - Padded with empty slots up to 45 per chest page.
  - Missing and Upgradable accessories are excluded from the chest slots and rendered directly at the bottom in the Card Grid format using `AccessoryCard`.
- **Quality & Rule Compliance**:
  - 10/10 Vitest test suites passing (42 tests).
  - TypeScript strict mode passing with 0 errors (`npx tsc --noEmit`).
  - All source files strictly under 300 lines (Rule 5).
  - All visual evidence captured and verified.

## Known Problems

- None. All requested features, corrections, and visual behaviors are passing with verified evidence.

## Next Three Steps

1. Commit changes to git with a descriptive message.
2. Present full verification results and evidence to the user.
3. Stand by for any further instructions.
