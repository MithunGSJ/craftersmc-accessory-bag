# Project Progress

## Current Phase
- Maintenance, Live Market Price Syncing & CraftersMC API Alignment

## What Changed Last
- Fixed valuation of `fused_remnants` to 6,400,000 coins (6.4M) derived from 32x `remnant_of_the_eye` at 200,000 coins (200k) NPC price in the End.
- Prevented `fused_remnants` from being queried against Bazaar API in both automated cron sync (`scripts/syncPricing.ts`) and live dev server plugin (`src/server/livePricingPlugin.ts`).
- Added `subMaterial` breakdown on `fused_remnants` for Draconic accessories (Talisman: 64 Remnant of the Eye; Ring: 128; Artifact: 384) in `src/data/accessoryRecipes.ts` and `src/data/wikiRecipes.json`.
- Updated `AccessoryModal.tsx` to cleanly handle equal-cost sub-material craft breakdown.
- Verified all 14 test suites and 74 unit tests pass with 0 errors.

## Known Problems
- `red_claw_egg` is traded on Bazaar in-game on CraftersMC, but the official public REST API (`api.craftersmc.net`) does not yet expose it in `/v1/skyblock/bazaar/:itemId/details`. Baseline pricing (8.5M coins) is preserved.

## Next Three Steps
1. Verify live GitHub Actions automated pricing sync passes cleanly with the new End NPC fixed pricing.
2. Confirm user satisfaction with Draconic accessory recipe and cost breakdowns in the accessory modal.
3. Monitor CraftersMC API updates for when server administrators add `red_claw_egg` to their REST API whitelist.
