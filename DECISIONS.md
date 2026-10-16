# Architectural Decisions

| ID | Decision | Reason |
| :--- | :--- | :--- |
| DEC-001 | Use Vite + React + TypeScript in strict mode | Provides instantaneous HMR, robust static typing, and lightweight runtime without framework bloat. |
| DEC-002 | Use pure Vanilla CSS with design token variables (no Tailwind) | Complies with project guidelines, enables pixel-perfect custom Minecraft/SkyBlock glassmorphism aesthetic. |
| DEC-003 | Separate pure logic from UI rendering | Ensures 100% testability with Vitest unit tests for NBT decoding, MP calculation, and upgrade resolution. |
| DEC-004 | Support both live API lookup, Base64 NBT input, and bundled offline demo profiles | Ensures full functionality even if user does not supply an API key or has rate limit constraints. |
| DEC-005 | Synthesize audio using Web Audio API | Zero external audio asset dependencies, instantaneous playback, zero latency, toggleable for user convenience. |
| DEC-006 | Group accessories into Upgrade Families | Prevents false positives where possessing a higher tier (e.g., Zombie Artifact) would flag lower tiers (Zombie Ring) as missing. |
| DEC-007 | Embed mandatory CraftersMC and Minecraft trademark disclaimers | Ensures full compliance with section 1 of the CraftersMC API Usage Policy. |
| DEC-008 | Scope accessory catalog strictly to active CraftersMC SkyBlock items | Strips non-existent Hypixel Dungeons / Catacombs / Enderman Slayer items (Wither Relic/Artifact, Auto-Recombobulator, Hegemony) to mirror true CraftersMC game state. |
| DEC-009 | Sync with official CraftersMC Wiki table and incorporate live API key | Added all 85 authentic obtainable accessories across 46 upgrade families, verified live API key for DarkKing0098994, and supported native CraftersMC NBT inventory format. |
| DEC-010 | Replace legacy Hypixel coin estimations with authentic CraftersMC Wiki obtaining requirements & progression milestones | CraftersMC accessories are governed by Collections, Quests, Slayers, Drops, and NPC Shop prices. |
| DEC-011 | Download and bundle authentic CraftersMC Wiki pixel-art sprites for all accessories | Replaced generic emojis with official high-resolution wiki item sprites rendered crisply with `image-rendering: pixelated;` and emoji fallback. |
| DEC-012 | Set Golden Feather Boots as Tier 4 upgrade of Feather Artifact in feather family | Aligns with user specification; computes upgrade MP difference and combines Feather Artifact cost with 64x Enchanted Feathers. |
| DEC-013 | Integrate live CraftersMC Bazaar material prices & active Auction House endpoints | Computes live craft costs from Bazaar weekly average prices multiplied by material counts, alongside direct active auction min/max/avg ranges. |
| DEC-014 | Prioritize active BIN listings with outlier trimming & dual-tier material comparison | Prevents unbid troll normal auctions from skewing averages, and audits exact in-game recipe grids (e.g. 9x Enchanted Lapis Blocks vs 1,440x Enchanted Lapis Lazuli). |
| DEC-015 | Strictly hide superseded lower-tier accessories when a higher tier in that family is owned | Eliminates obsolete zero-MP cards (e.g. Personal Deletor 4000/5000/6000 when 7000 is owned) to keep the catalog clean. |
| DEC-016 | Place Dayfreezer and Nightfreezer into shared day_night_freezer family with non-stacking MP | Enforces that only one of Dayfreezer or Nightfreezer grants active +16 MP in the bag, matching game mechanics. |
| DEC-017 | Format exact NPC shop prices without 'Est:' or '~' prefixes and preserve Gems currency | Ensures NPC items display exact vendor price (e.g. Sky's Badge: 21.5M, Zoe: 945 Gems) and prevents unit regex matching Gems as Billions. |
