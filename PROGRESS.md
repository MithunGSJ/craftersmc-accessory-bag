# Project Progress: CraftersMC SkyBlock Accessory Bag Web App

## Current Phase

Completed (FEAT-019: Accurate NPC Base Accessory Craft Valuation in Upgrade Chains)

## What Changed Last

- **Accurate Base NPC Talisman Craft Valuation (FEAT-019)**:
  - Updated `src/logic/pricingEngine.ts` in `calculateCraftCost`:
    - When an accessory recipe upgrades from a base accessory (`recipe.upgradesFrom`), resolved its definition via `findAccessoryById`.
    - If the parent accessory has an NPC shop cost (`parentNpc = parseNpcCost(parentDef?.npcCost)`), its authentic guaranteed NPC cost is used (e.g. 500 coins for `Zombie Talisman`, 10,000 coins for `Intimidation Talisman`).
    - Fixed recipe breakdown ingredient naming to display clean title-cased names (`1x Zombie Talisman` instead of `1x ZOMBIE TALISMAN`).
    - Removed stale/inflated auction listings from `pricingSnapshot.json` for coin NPC items (`ZOMBIE_TALISMAN`, `VILLAGE_AFFINITY_TALISMAN`, `INTIMIDATION_TALISMAN`).
  - **Zombie Ring Verification**:
    - `• 1x Zombie Talisman (@ 500/ea)  500`
    - `• 64x Revenant Flesh (@ 350/ea)  22.4K`
    - `Total Craft Cost: ~22.9K (22,868 coins)` (down from inaccurate ~122.4K).
- **Visual Evidence Verified**:
  - `evidence/modal-zombie-ring-500-cost-verified.png`: Confirms `Zombie Ring` craft breakdown uses 500 coins for `Zombie Talisman` and total craft cost ~22.9K.
  - `evidence/card-zombie-ring-verified.png`: Confirms `Zombie Ring` card badge displays `🌾 Craft: ~22.9K`.
- **Quality & Rule Compliance**:
  - Unit test in `src/logic/pricingEngine.test.ts` verifying `Zombie Ring` craft breakdown and 500 coin unit price.
  - 11/11 Vitest test suites passing (46 tests).
  - TypeScript strict mode passing with 0 errors (`npx tsc --noEmit`).
  - Production build passing (`npm run build`).
  - Source files strictly under 300 lines (Rule 5).

## Known Problems

- None. All requested features, corrections, and visual behaviors are passing with verified evidence.

## Next Three Steps

1. Commit all verified changes to git with a descriptive commit message.
2. Present full verification results and evidence to the user.
3. Stand by for any further instructions.
