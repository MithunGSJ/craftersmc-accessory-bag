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

  - Removed MediaWiki sync status banner text from UI per user direction, keeping the hero header clean and minimalist while background polling continues silently.
  - Implemented WikiBrain intelligence engine ([src/logic/wikiBrain.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/logic/wikiBrain.ts)) to deeply evaluate MediaWiki wikitext flags (`{{Ambox admin}}`, `{{Ambox removed}}`, `source: Removed`, `Unobtainable`, one-off staff rewards).
  - Automatically filtered out non-obtainable accessories (`Acacia Stop`, `Beta Fish`, `Filthy Rich Talisman`, `Mini Fairy`, `Magical Encyclopedia`, `Creative Mind`, `Game Breaker`) from the catalog, ensuring they never appear as missing accessories to regular players.
  - **Piggy Bank Degraded Variants & Non-Stacking MP**:
    - Unified `Piggy Bank`, `Cracked Piggy Bank`, and `Broken Piggy Bank` into the shared `'piggy_bank'` family.
    - Added `isDegradedVariant` flag to indicate damaged states triggered by in-game deaths.
    - When a player owns `Piggy Bank`, neither Cracked nor Broken appears as missing, eliminating duplicate missing cards.
    - When a player owns Cracked or Broken, Piggy Bank is marked as repairable (`UPGRADABLE_NEXT`), fulfilling the family without missing penalty.
    - Enforced non-stacking MP: only one piggy bank in the family can ever grant active Magical Power (+5 MP), with zero extra MP for duplicates.
    - Playwright test [scripts/verifyPiggyBankMissing.cjs](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/scripts/verifyPiggyBankMissing.cjs) and screenshot [tmp/piggy_bank_missing_verified.png](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/tmp/piggy_bank_missing_verified.png) verify zero broken/cracked missing cards for both fresh and owned profiles.
  - **Apostrophe Accessory Deduplication & ID Aliasing**:
    - Discovered root cause of `Pig's Foot`, `Sky's Badge`, and `New Year's Cake Bag` appearing as missing: wiki scraper replaced apostrophes with underscores (`PIG_S_FOOT`, `SKY_S_BADGE`, `NEW_YEAR_S_CAKE_BAG`), failing exact ID match against baseline items (`PIGS_FOOT`, `SKYS_BADGE`, `NEW_YEARS_CAKE_BAG`) and creating duplicate phantom accessories.
    - Added deduplication by normalized name (`name.toLowerCase().replace(/[^a-z0-9]/g, '')`) and contracted ID in [src/data/accessoryRegistry.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/data/accessoryRegistry.ts).
    - Added alias and contracted fallback in `findAccessoryById` and name lookup in `accessoryMatcher.ts` to ensure in-game bag items match canonical IDs regardless of naming format.
    - Updated wiki scraper [scripts/syncWikiData.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/scripts/syncWikiData.ts) and [src/data/wikiAccessories.json](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/data/wikiAccessories.json) to eliminate duplicate IDs.
    - Verified with Playwright [scripts/verifyOwnedNotMissing.cjs](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/scripts/verifyOwnedNotMissing.cjs) and screenshot [tmp/owned_not_missing_verified.png](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/tmp/owned_not_missing_verified.png): 0 missing cards, all 3 show strictly as Owned.
  - **Future Accessory Resilience Engine (FEAT-032)**:
    - Guaranteed all future accessories discovered via the 30-minute MediaWiki polling engine, added via in-game NBT, or imported via profiles will never suffer from duplicate entries, phantom missing cards, or uncataloged card cloning.
    - Added possessive/plural tolerance in `findAccessoryById` (e.g. `NEW_YEAR_CAKE_BAG` automatically matches `New Year's Cake Bag`).
    - Added reforge prefix stripper across 50 in-game reforges (`Pleasant`, `Shaded`, `Silky`, `Godly`, etc.) in `findAccessoryByName` so reforged player items cleanly resolve to their base canonical definition.
    - Updated `evaluatePlayerAccessories` to check both ID and `displayName` before synthesizing uncataloged definitions, completely preventing duplicate cards.
    - Added comprehensive unit test suite [src/logic/futureAccessoryResilience.test.ts](file:///C:/Users/OM/Documents/Crafters%20-%20Copy/src/logic/futureAccessoryResilience.test.ts) covering apostrophe contractions, possessive variations, reforge stripping, punctuation tolerance, and obtainability filtering.
    - All 74 Vitest unit tests pass across 14 test suites. Production build succeeds with 0 errors. All source files strictly under 300 lines.

## Known Problems

- None.

## Next Three Steps

1. Commit all changes to the git repository with descriptive commit message.
2. Present complete, detailed audit and review log to the user.
3. Keep background sync worker and dev server running.
