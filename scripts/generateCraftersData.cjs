const fs = require('fs');

const wikiData = JSON.parse(fs.readFileSync('scripts/craftersmc_wiki_all.json', 'utf8'));
const wikiByName = new Map();
for (const w of wikiData) {
  wikiByName.set(w.name.toLowerCase().trim(), w);
}

// Special definitions for the 10 event items not in the simple table (Bat & Candy lines)
const eventWikiDetails = {
  'bat talisman': {
    description: "Grants +2 Health, +1 Intelligence, and +1 Speed to the player.",
    obtaining: "Dropped from Witch's Bat summoned by Crazy Witch during Spooky Festival"
  },
  'bat ring': {
    description: "Grants +3 Health, +2 Intelligence, and +2 Speed to the player.",
    obtaining: "Crafting (Bat Talisman + 64 Green Candy at Terrik)"
  },
  'bat artifact': {
    description: "Grants +5 Health, +3 Intelligence, and +3 Speed to the player.",
    obtaining: "Crafting (Bat Ring + 64 Purple Candy at Terrik)"
  },
  'bat person talisman': {
    description: "Grants +2 Strength, +2 Defense, and +2 Intelligence for every bat summoned.",
    obtaining: "1.04% chance to drop from Trick or Treat Chest during Spooky Festival"
  },
  'bat person ring': {
    description: "Grants +3 Strength, +3 Defense, and +3 Intelligence for every bat summoned.",
    obtaining: "Crafting (Bat Person Talisman + 64 Green Candy at Terrik)"
  },
  'bat person artifact': {
    description: "Grants +5 Strength, +5 Defense, and +5 Intelligence for every bat summoned.",
    obtaining: "Crafting (Bat Person Ring + 64 Purple Candy at Terrik)"
  },
  'candy talisman': {
    description: "Increases the drop chance of Green Candy and Purple Candy by +5% during Spooky Festival.",
    obtaining: "Terrik (16 Green Candy)"
  },
  'candy ring': {
    description: "Increases the drop chance of Green Candy and Purple Candy by +10% during Spooky Festival.",
    obtaining: "Terrik (Candy Talisman + 64 Green Candy)"
  },
  'candy artifact': {
    description: "Increases the drop chance of Green Candy and Purple Candy by +15% during Spooky Festival.",
    obtaining: "Terrik (Candy Ring + 32 Purple Candy)"
  },
  'candy relic': {
    description: "Increases the drop chance of Green Candy and Purple Candy by +20% during Spooky Festival.",
    obtaining: "Terrik (Candy Artifact + 64 Purple Candy)"
  },
  'intimidation ring': {
    description: "Monsters under Level 5 will not target you.",
    obtaining: "Terrik (Intimidation Talisman + 100 Green Candy)"
  },
  'intimidation artifact': {
    description: "Monsters under Level 25 will not target you.",
    obtaining: "Terrik (Intimidation Ring + 100 Purple Candy)"
  },
  'seal of the seas': {
    description: "Magic Find: +1% Grants +1 coin for every 25 coins you gain from mobs.",
    obtaining: "\"Lost Treasures\" quest (Steal coins option)"
  }
};

function getWikiItem(name) {
  const lower = name.toLowerCase().trim();
  if (eventWikiDetails[lower]) {
    return eventWikiDetails[lower];
  }
  const found = wikiByName.get(lower);
  if (found) {
    return {
      description: found.description || "Official CraftersMC SkyBlock accessory.",
      obtaining: found.obtaining || "CraftersMC Wiki"
    };
  }
  return {
    description: "Official CraftersMC SkyBlock accessory.",
    obtaining: "CraftersMC Wiki"
  };
}

console.log('Script loaded.');
module.exports = { getWikiItem };
