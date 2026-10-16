# Scripts Directory Documentation

This directory contains automated verification scripts, test runners, and one-time data extraction tools.

## Active Verification Scripts (CI & QA)

- **`verifyQualityCompliance.js`**: Core quality gate runner that enforces:
  - File line counts (< 300 lines per Rule 5).
  - Clean code scan (zero `TODO` or `FIXME` comments).
  - TypeScript strict compilation (`tsc --noEmit`).
  - Vitest unit test suite (100% pass rate).
  - CraftersMC API Usage Policy compliance.
- **`verifyResponsive.js`**: Headless browser test verifying layout at Mobile (375x812), Tablet (768x1024), and Desktop (1440x900).
- **`captureScreenshots.js`**: Playwright test capturing hero header, accessory grid, and modal dialogs.
- **`captureFixesEvidence.js`**: Playwright test capturing evidence for accessory tier deduplication, Dayfreezer/Nightfreezer shared MP, and exact NPC price formatting.

## One-Time Scraper & Data Generation Tools

The `.cjs` scripts in this folder were used during initial project bootstrap to extract and cross-reference accessory statistics, crafting recipes, and sprite assets from the official CraftersMC Wiki and Public API endpoints:
- `downloadAllWikiIcons.cjs` / `downloadIconsViaPlaywright.cjs`: Extracted official sprite PNGs into `public/icons/accessories/`.
- `scanAccessoryAuctions.cjs` / `recalculateAuctionStats.cjs`: Pulled active CraftersMC Auction House listings with BIN outlier filtering into `src/data/pricingSnapshot.json`.
- `testBazaarDetails.cjs`: Validated CraftersMC Bazaar API material costs.
- `extractCraftersWiki.cjs` / `parseWikiTable.cjs`: Extracted table data from `craftersmc.wiki.gg`.

*(Retained for reproducible builds and audit history. Do not delete without human review.)*
