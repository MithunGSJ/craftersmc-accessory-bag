# Project Progress: CraftersMC SkyBlock Accessory Bag Web App

## Current Phase

Completed (Accessory Tier Deduplication, Dayfreezer/Nightfreezer Shared MP, NPC Price Precision & Sprite Fixes)

## What Changed Last

- **Superseded Lower Tiers Automatically Hidden**: When a player owns a higher-tier accessory (e.g. Personal Deletor 7000, Campfire God Badge, Bat Artifact), all lower tiers (4000/5000/6000) are cleanly omitted from the grid view, eliminating obsolete zero-MP clutter.
- **Dayfreezer & Nightfreezer Shared Family & Non-Stacking MP**: Linked Dayfreezer and Nightfreezer under the shared `day_night_freezer` family. If both are owned in a bag, exactly ONE grants +16 MP; the other yields 0 MP (and is clearly marked as shared in the modal).
- **Dayfreezer & Nightfreezer Gems Currency Fixed**: Fixed `parseNpcCost` regex so special currencies (Gems/Bits) are never parsed as billions (`945.0B`), displaying the authentic `NPC: 945 Gems` from Zoe.
- **Exact NPC Shop Prices (No "Est:" or "~")**: For all NPC items, display the exact vendor purchase cost directly without approximation prefixes (e.g. `Sky's Badge: NPC: 21.5M`, `New Year's Cake Bag: NPC: 250.0K`, `Mine Affinity Talisman: NPC: 2.5K`).
- **Sky's Badge & New Year's Cake Bag Pixel Art Sprites**: Ensured official high-resolution wiki sprites load cleanly via multi-candidate fallback paths in `AccessoryIcon.tsx`.
- **Unit Tests Expanded**: 38/38 tests passing across 10 Vitest suites (added specific tests for non-stacking Dayfreezer/Nightfreezer, Personal Deletor tier deduplication, and exact NPC currency formatting).
- **Playwright Visual Verification Captured**: `FIX-001-personal-deletor-no-lower-tiers.png`, `FIX-002-dayfreezer-nightfreezer-gems.png`, `FIX-003-skys-badge-icon-and-price.png`, and `FIX-004-cake-bag-icon-and-price.png`.

## Known Problems

- None. All requested bug fixes, visual icons, pricing labels, and MP stacking rules are fully verified.

## Next Three Steps

1. Application is active and hot-reloaded on `http://localhost:5173`.
2. Review evidence screenshots in `evidence/FIX-001` through `FIX-004`.
3. Ready for user presentation and final feedback.
