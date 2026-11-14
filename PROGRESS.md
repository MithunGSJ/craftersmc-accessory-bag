# Project Progress

## Current Phase

- Codebase Bug Resolution & Hardening Complete

## What Changed Last

- Fixed all 18 bugs identified in the comprehensive audit across logic, data, UI, and infrastructure:
  1. `src/logic/accessoryParser.ts`: Fixed `§f` priority inversion, regex word boundary lore extraction, slot finite check (`Number.isFinite`), non-accessory filtering in format 2 items, reforge prefix stripping, and recombobulator detection without lore.
  2. `src/logic/accessoryMatcher.ts`: Prevented premature `UPGRADED_PREVIOUS` masking on owned lower tiers, eliminated bogus upgrade recommendations on unowned items, fixed ALL view filter, and decoupled `SEAL_OF_THE_SEAS`/`SEAL_OF_THE_OCEANS`.
  3. `src/logic/nbtReader.ts`: Added buffer boundary validation (`ensureBytes`) and size checks to prevent uncaught `RangeError`.
  4. `src/logic/pricingEngine.ts`: Handled negative values, `NaN`, non-finite, and large numbers cleanly.
  5. `src/logic/profileLoader.ts`: Fixed case-insensitive UUID resolution, profile ID fallbacks, negative caching of empty profiles, and object-to-string extraction.
  6. `src/logic/statsCalculator.ts`: Corrected lower-tier owned count accounting, UI filter missing counts, and dynamic max MP.
  7. `src/logic/wikiBrain.ts`: Word boundaries for categories, Roman numeral collection downgrade protection, cardinal direction shop filter, and subheadings parsing.
  8. `src/components/CustomLookupModal.tsx`: Fixed username wiping on reload, focus retention, focus trap with disabled elements, and backdrop drag dismissal.
  9. `src/components/StatsOverview.tsx`: Used `ownedFamiliesCount` numerator and guarded progress bar `NaN`.
  10. `src/components/AccessoryModal.tsx`: Preserved focus across tier switching, added initial focus, and backdrop dismissal guard.
  11. `src/components/RecommendationsPanel.tsx`: Guarded division by zero when `mpGain === 0`, and deduplicated standalone items.
  12. `src/App.tsx`: Added `pricingHydrated` to memoization dependency array and added lookup request ID race condition guard.
  13. `src/components/AccessoryCard.tsx`: Guarded auction min/max/avg price formatting against null/undefined.
  14. `api/proxy.ts` & `vercel.json`: Path parameter forwarding with `/api/proxy?path=$1` and client Authorization / X-API-Key forwarding.
  15. `src/server/livePricingPlugin.ts`: Auction bid prioritizing active `highestBidAmount` over `startingPrice`, and started wiki sync worker in preview server.
  16. `src/data/accessoryRegistry.ts`: Plural/apostrophe name normalization, broadened family ID suffixes, and fixed Piggy Bank category.
  17. `src/data/accessoriesGathering.ts`: Decoupled `SEAL_OF_THE_SEAS` and `SEAL_OF_THE_OCEANS` into distinct families.
  18. `scripts/*.cjs`: Guarded 15 legacy scripts against hardcoded absolute paths with existence check and environment variable fallbacks.
- Verified: `npx tsc --noEmit` passed with 0 errors; 14 test suites and 93 tests passed; Vite production build passed; all source files strictly under 300 lines.

## Known Problems

- None.

## Next Three Steps

1. Commit changes to git.
2. Deliver final report to coordinator.
3. Monitor automated sync workflows.
