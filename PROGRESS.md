# Project Progress: CraftersMC SkyBlock Accessory Bag Web App

## Current Phase

Completed (FEAT-018: Coin NPC Accessories Auction Price Suppression)

## What Changed Last

- **Coin NPC Accessories Auction Price Suppression (FEAT-018)**:
  - Updated `src/logic/pricingEngine.ts`: When an accessory is purchasable from an NPC using coins (`npcNum && npcNum > 0`), explicitly set `auction: undefined`.
  - Affected coin NPC items:
    - `Mine Affinity Talisman` (2,500 coins from Julia/Adventurer)
    - `Village Affinity Talisman` (2,000 coins from Adventurer)
    - `Scavenger Talisman` (10,000 coins from Adventurer)
    - `Sky's Badge` (21,500,000 coins from Sky)
    - `Skeleton Talisman` (500 coins from Adventurer)
    - `Zombie Talisman` (500 coins from Adventurer)
    - `Intimidation Talisman` (10,000 coins from Adventurer)
    - `Blood God Crest` (1,250,000 coins from Romero)
    - `New Year's Cake Bag` (250,000 coins from Baker)
  - UI Behaviors Verified:
    - **AccessoryCard**: Removed the secondary `AH: ~...` badge; card tooltip shows `NPC: <price>` instead of auction min/max/avg.
    - **AccessoryModal**: Removed `CraftersMC Auction House` market box and "No offers were made" box; displays exact `NPC: <price> Coins` valuation badge in cyan.
    - **MinecraftTooltip**: Shows `🪙 NPC: <price>` without any AH range line.
    - Non-coin items (Dayfreezer / Nightfreezer at 945 Gems) and drop/craft accessories retain auction pricing where applicable.
- **Visual Evidence Verified**:
  - `evidence/card-mine-affinity-npc-no-auction.png`: Shows Mine Affinity Talisman card with `🪙 NPC: 2.5K` and zero auction badges.
  - `evidence/modal-mine-affinity-npc-no-auction.png`: Shows modal with `NPC: 2,500 Coins` and zero auction house boxes.
  - `evidence/card-skys-badge-npc-no-auction.png`: Shows Sky's Badge card with `🪙 NPC: 21.5M` and zero auction badges.
  - `evidence/modal-skys-badge-npc-no-auction.png`: Shows Sky's Badge modal with `NPC: 21,500,000 Coins` and zero auction house boxes.
- **Quality & Rule Compliance**:
  - Added unit test assertions in `src/logic/pricingEngine.test.ts` and `src/logic/auditPdf.test.ts`.
  - 11/11 Vitest test suites passing (45 tests).
  - TypeScript strict mode passing with 0 errors (`npx tsc --noEmit`).
  - Production build passing (`npm run build`).
  - Source files strictly under 300 lines (Rule 5).

## Known Problems

- None. All requested features, corrections, and visual behaviors are passing with verified evidence.

## Next Three Steps

1. Commit all verified changes to git with a descriptive commit message.
2. Present full verification results and evidence to the user.
3. Stand by for any further instructions.
