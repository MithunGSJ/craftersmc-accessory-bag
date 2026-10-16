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
