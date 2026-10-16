const https = require('https');
const fs = require('fs');

const url = 'https://craftersmc.wiki.gg/images/thumb/Zombie_Talisman.png/64px-Zombie_Talisman.png';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Referer': 'https://craftersmc.wiki.gg/'
  }
}, (res) => {
  console.log('Thumbnail Status:', res.statusCode);
  const chunks = [];
  res.on('data', c => chunks.push(c));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    console.log('Thumb bytes:', buf.length);
  });
});
