# Project Progress: CraftersMC SkyBlock Accessory Bag Web App

## Current Phase

Completed (Pixel-Art Wiki Icons, Golden Feather Boots Tier 4 Upgrade, CraftersMC Bazaar & Auction Live Pricing Engine)

## What Changed Last

- Replaced all emojis across cards, modals, and recommendation panels with authentic, official CraftersMC Wiki pixel-art sprites stored locally in `public/icons/accessories/<id>.png` with crisp `image-rendering: pixelated;` and emoji fallback (`AccessoryIcon.tsx`).
- Upgraded `FEATHER_ARTIFACT` to `GOLDEN_FEATHER_BOOTS` as Tier 4 of the `feather` upgrade family in `src/data/accessoriesSpecial.ts` and defined its craft recipe (Feather Artifact + 64x Enchanted Feathers).
- Built `src/logic/pricingEngine.ts` and `src/data/accessoryRecipes.ts`:
  - Defined recipes for craftable accessories.
  - Queries CraftersMC Bazaar details (`/v1/skyblock/bazaar/{itemId}/details`) for `weeklyAveragePrice` of each ingredient, multiplies by quantity needed, and combines them (including base accessory costs) to calculate the authentic Craft Cost.
  - Queries CraftersMC active auctions (`/v1/skyblock/auctions`) to extract least (min), highest (max), and average (avg) auction prices for mob drops and accessories.
  - Displays dynamic pricing badges on cards, itemized crafting & auction breakdowns in modals, and cost-per-MP efficiency metrics in the recommendations panel.
- Added comprehensive unit tests in `src/logic/pricingEngine.test.ts` (100% test pass: 32/32 tests across 10 test suites).
- Passed all code quality gates: 0 TypeScript errors, 0 ESLint warnings, all 39 source files under 300 lines, and captured visual Playwright verification screenshots.

## Known Problems

- None. All user requirements and acceptance criteria verified and passing.

## Next Three Steps

1. Application is active on `http://localhost:5173`.
2. Review the live visual demonstration with pixel-art sprites and real-time Bazaar/Auction valuations.
3. Ready for user interaction and audit.

