# Project Progress

## Current Phase
- Maintenance, Live Market Price Syncing & CraftersMC API Alignment

## What Changed Last
- Fixed Envoy's Horn Bazaar item mapping: CraftersMC API uses `envoy_horns` (weekly average ~566 coins, 15k+ volume). Added alias mapping and updated `src/data/accessoryRecipes.ts`, `src/data/pricingSnapshot.json`, and `scripts/syncPricing.ts`.
- Investigated `red_claw_egg`: verified CraftersMC REST API whitelist (285 items) currently omits `red_claw_egg`, and clarified sync logging to retain realistic baseline (8.5M coins).
- Explained the browser `missing_api_key` response when clicking direct API URLs in terminal without headers.

## Known Problems
- `red_claw_egg` is traded on Bazaar in-game on CraftersMC, but the official public REST API (`api.craftersmc.net`) does not yet expose it in `/v1/skyblock/bazaar/:itemId/details`. Baseline pricing is preserved.

## Next Three Steps
1. Verify live GitHub Actions automated pricing sync passes cleanly with the new alias mapping.
2. Ask user for current in-game market price for Red Claw Egg to refine baseline if needed.
3. Monitor CraftersMC API updates for when server administrators add `red_claw_egg` to their REST API whitelist.
