const fs = require('fs');

const html = fs.readFileSync('C:/Users/OM/.gemini/antigravity-ide/brain/f369ad55-8d3b-463f-86ec-15feb605d54a/.system_generated/steps/1041/content.md', 'utf8');

// Find all table content
const tableMatch = html.match(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>([\s\S]*?)<\/table>/i);
if (tableMatch) {
  const rows = tableMatch[1].match(/<tr[\s\S]*?<\/tr>/gi) || [];
  console.log('Total table rows in Accessories page wikitable:', rows.length);
}

// Find navbox or other lists
const navboxMatch = html.match(/<table[^>]*class="[^"]*navbox[^"]*"[^>]*>([\s\S]*?)<\/table>/gi) || [];
console.log('Navbox tables found:', navboxMatch.length);
if (navboxMatch.length > 0) {
  navboxMatch.forEach((nav, idx) => {
    const text = nav.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`Navbox ${idx + 1}: ${text.slice(0, 300)}...`);
  });
}

// Also check all links on the page
const linkMatches = html.match(/href="\/wiki\/([^"#]+)"/g) || [];
const uniqueLinks = [...new Set(linkMatches.map(m => m.replace(/href="\/wiki\//, '').replace(/"/, '')))];
console.log('Total unique wiki links on Accessories page:', uniqueLinks.length);

const accessoryKeywords = ['Talisman', 'Ring', 'Artifact', 'Relic', 'Badge', 'Crest', 'Charm', 'Freezer', 'Compactor', 'Deletor', 'Devourer', 'Extinguisher', 'Bank', 'Slice', 'Boots', 'Orb', 'Bag', 'Seal', 'Foot'];
const foundKeywords = uniqueLinks.filter(l => accessoryKeywords.some(kw => l.includes(kw)));
console.log('Links matching accessory keywords:', foundKeywords);
