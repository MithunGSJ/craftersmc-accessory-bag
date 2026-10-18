# Project Progress: CraftersMC SkyBlock Accessory Bag Web App

## Current Phase

Phase 5: Automated 30-Minute MediaWiki Recipe Extraction & Polling Engine Complete

## What Changed Last

- **MediaWiki Crafting Recipe Extraction Engine**:
  - Implemented balanced curly-brace depth parser in [scripts/extractWikiRecipes.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/scripts/extractWikiRecipes.ts) for nested `{{Craft ...}}` and `{{Slot|Item|Count}}` MediaWiki templates.
  - Automatically identifies `upgradesFrom` parent accessories, filters out `Air` empty slots, and aggregates item counts across the 3x3 crafting grid.
  - Extracted 40 authentic crafting recipes from official CraftersMC Wiki into [src/data/wikiRecipes.json](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/data/wikiRecipes.json).
  - Merged [src/data/wikiRecipes.json](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/data/wikiRecipes.json) dynamically into `ACCESSORY_RECIPES` ([src/data/accessoryRecipes.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/data/accessoryRecipes.ts)).

- **Dynamic Catalog & Material Integration**:
  - Extracted 77 accessories from CraftersMC Wiki table into [src/data/wikiAccessories.json](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/data/wikiAccessories.json).
  - Dynamically merged wiki accessories into `ALL_ACCESSORIES` ([src/data/accessoryRegistry.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/data/accessoryRegistry.ts)) with inferred categories, tiers, and families, expanding total recognized catalog from 85 to 97 accessories.
  - Live pricing engine automatically extracts all required materials dynamically from `ACCESSORY_RECIPES` and calculates craft costs.

- **Automated 30-Minute Polling Service**:
  - Created [src/server/wikiSyncWorker.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/server/wikiSyncWorker.ts) background worker running an automatic `setInterval` check every 30 minutes (`30 * 60 * 1000` ms).
  - Added REST endpoints `/api/wiki/status` and `/api/wiki/sync` in [src/server/livePricingPlugin.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/server/livePricingPlugin.ts).
  - Added standalone CLI script [scripts/watchWiki.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/scripts/watchWiki.ts) executable via `npm run watch:wiki`.
  - Updated [.github/workflows/auto-sync.yml](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/.github/workflows/auto-sync.yml) scheduled cron to `*/30 * * * *` (runs every 30 minutes in GitHub Actions) and updated [scripts/verifyFeat028.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/scripts/verifyFeat028.ts).

- **UI & Test Verification**:
  - Added real-time glowing status indicator in [src/components/HeroHeader.tsx](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/components/HeroHeader.tsx).
  - Added unit test suite [src/logic/wikiRecipeSync.test.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/logic/wikiRecipeSync.test.ts) (59/59 Vitest unit tests pass across 12 test files).
  - Production build succeeds with 0 errors. All source files strictly under 300 lines (0 files >= 300 lines).

## Known Problems

- None.

## Next Three Steps

1. Commit changes to git repository.
2. Present comprehensive audit and review log to the user.
3. Keep dev server and background sync worker active.
