const https = require('https');
const fs = require('fs');

const url = 'https://craftersmc.wiki.gg/images/thumb/Zombie_Talisman.png/28px-Zombie_Talisman.png?d9411e';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': 'https://craftersmc.wiki.gg/wiki/Accessories'
  }
}, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  const chunks = [];
  res.on('data', c => chunks.push(c));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    console.log('Downloaded bytes:', buf.length);
    if (res.statusCode === 200 && buf.length > 100) {
      fs.writeFileSync('scripts/zombie_talisman.png', buf);
      console.log('Saved successfully!');
    }
  });
}).on('error', e => console.error(e));
