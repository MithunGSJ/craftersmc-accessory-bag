# Project Progress: CraftersMC SkyBlock Accessory Bag Web App

## Current Phase

Phase 5: Full End-to-End Automation (Implementing FEAT-026: Dynamic NBT Skull Texture Extraction & Uncataloged Accessory Fallback)

## What Changed Last

- **Completed FEAT-025 (Live Bazaar & Auction Pricing Engine Middleware)**:
  - Built Vite server background plugin `src/server/livePricingPlugin.ts` polling `/v1/skyblock/auctions` and caching aggregated min/avg/median/max stats at `/api/pricing/live`.
  - Added dynamic pricing cache hydration in `src/logic/pricingEngine.ts` with `hydrateLivePricing()`, `setLiveAuctionPrice()`, and `clearPricingCache()`.
  - Added unit test in `src/logic/pricingEngine.test.ts`. Verified with Vitest (15/15 passed).
  - Saved evidence to `tmp/evidence_feat_025_live_pricing.json` and marked `FEAT-025` passing in `features.json`.

## Known Problems

- None.

## Next Three Steps

1. Implement `FEAT-026`: Dynamic NBT skull texture extraction in `src/logic/accessoryParser.ts` and uncataloged item fallback in `src/logic/accessoryMatcher.ts` and `AccessoryIcon.tsx`.
2. Implement `FEAT-027`: Automated MediaWiki scraper engine script `scripts/syncWikiData.ts` and `npm run sync:wiki` command.
3. Implement `FEAT-028`: Automated CI/CD GitHub Actions Workflow (`.github/workflows/auto-sync.yml`).
