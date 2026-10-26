# Project Progress

## Current Phase
- Maintenance, Live Market Price Syncing & CraftersMC API Alignment

## What Changed Last
- Treated Dayfreezer and Nightfreezer as mutually interchangeable variants in `day_night_freezer` family: if a player owns either one, the other is marked `UPGRADED_PREVIOUS` and suppressed from missing views, missing counts, and recommendations.
- Updated `AccessoryModal` to display "Freezer Variants (Shared MP)" and indicate shared MP when one variant is already owned.
- Deduplicated `RecommendationsPanel` by family so alternative variants never take multiple recommendation slots.

## Known Problems
- `red_claw_egg` is traded on Bazaar in-game on CraftersMC, but the official public REST API (`api.craftersmc.net`) does not yet expose it in `/v1/skyblock/bazaar/:itemId/details`. Baseline pricing (8.5M coins) is preserved.

## Next Three Steps
1. Verify live GitHub Actions automated pricing sync passes cleanly.
2. Confirm user satisfaction with Dayfreezer/Nightfreezer single-family mutual resolution.
3. Monitor CraftersMC API updates for when server administrators add `red_claw_egg` to their REST API whitelist.
