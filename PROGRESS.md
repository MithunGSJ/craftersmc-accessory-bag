# Project Progress

## Current Phase

- Codebase Bug Resolution & Hardening Complete

## What Changed Last

- Re-evaluated and hardened all 18 audited bugs across logic, UI, data, and scripts with deep test coverage:
  1. `src/logic/accessoryParser.ts`: Fixed `§f` priority inversion across any position in name, anchored badge regex to prevent false positives from descriptive lore mentioning common accessories, filtered non-accessory items in both format 1 and format 2, preserved recombobulated upgrades without lore, and hardened slot validation.
  2. `src/logic/accessoryMatcher.ts`: Maintained `OWNED` status for lower tiers while setting MP to 0, restricted upgrade recommendations strictly to owned accessories, and maintained filter integrity.
  3. `src/logic/nbtReader.ts`: Verified buffer boundary validation (`ensureBytes`) and size checks preventing uncaught `RangeError`.
  4. `src/logic/pricingEngine.ts`: Fixed negative rounding producing `'-0'`, added trillion format `T`, and ensured safe coin formatting.
  5. `src/logic/profileLoader.ts`: Added unit tests verifying API handling for dashed/undashed UUIDs, object vs string accessory bag, and zero negative caching for empty profiles.
  6. `src/logic/statsCalculator.ts`: Verified stats calculations and discrepancy elimination between overview cards and filters.
  7. `src/logic/wikiBrain.ts`: Extended collection level regex to support `Collection Tier VIII` and `Collection Level 9` without downgrading to Early Collection.
  8. `src/components/CustomLookupModal.tsx`: Preserved username on load, locked scroll, trapped focus, and guarded backdrop drag.
  9. `src/components/StatsOverview.tsx`: Displayed `ownedFamiliesCount` numerator and guarded progress bar `NaN`.
  10. `src/components/AccessoryModal.tsx`: Retained focus on tier change, added initial focus, and prevented drag dismissals.
  11. `src/components/RecommendationsPanel.tsx`: Fixed zero net-gain calculations and restricted missing recommendations to entry-tier (T1) accessories.
  12. `src/App.tsx`: Added `pricingHydrated` memoization dependency and request ID race condition guard.
  13. `src/components/AccessoryCard.tsx`: Guarded auction price displays against null/undefined.
  14. `api/proxy.ts` & `vercel.json`: Path parameter forwarding with `/api/proxy?path=$1` and client Authorization / X-API-Key forwarding.
  15. `src/server/livePricingPlugin.ts`: Auction bid prioritizing active `highestBidAmount` over `startingPrice`, and started worker in preview server.
  16. `src/data/accessoryRegistry.ts`: Plural/apostrophe name normalization, broadened family ID suffixes, and fixed Piggy Bank category.
  17. `src/data/accessoriesGathering.ts`: Decoupled `SEAL_OF_THE_SEAS` and `SEAL_OF_THE_OCEANS`.
  18. `scripts/*.cjs`: Guarded 15 legacy scripts against hardcoded absolute paths with existence check and environment variable fallbacks.
- Verified: `npx tsc --noEmit` passed with 0 errors; 14 test suites and 98 tests passed; Vite production build passed in 2.65s; 100% of source files strictly under 300 lines with zero `: any` or TODOs.

## Known Problems

- None.

## Next Three Steps

1. Commit changes to git.
2. Deliver final report to coordinator.
3. Monitor automated sync workflows.
