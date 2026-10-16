const https = require('https');
const fs = require('fs');

const url = 'https://craftersmc.wiki.gg/images/Feather_Artifact.png';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://craftersmc.wiki.gg/'
  }
}, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  const chunks = [];
  res.on('data', c => chunks.push(c));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    console.log('Downloaded bytes:', buf.length);
    if (res.statusCode === 200 && buf.length > 500) {
      fs.writeFileSync('scripts/test_icon.png', buf);
      console.log('Saved scripts/test_icon.png successfully!');
    }
  });
}).on('error', e => console.error('Error:', e.message));
