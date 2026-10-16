const https = require('https');
const fs = require('fs');

const url = 'https://craftersmc.wiki.gg/images/thumb/Pig%27s_Foot.png/64px-Pig%27s_Foot.png?a9010b';
const dest = 'public/icons/accessories/pigs_foot.png';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': 'https://craftersmc.wiki.gg/wiki/Pig%27s_Foot'
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  if (res.statusCode === 200) {
    const stream = fs.createWriteStream(dest);
    res.pipe(stream);
    stream.on('finish', () => {
      stream.close();
      fs.copyFileSync('public/icons/accessories/pigs_foot.png', 'public/icons/accessories/pig_foot.png');
      fs.copyFileSync('public/icons/accessories/pigs_foot.png', 'public/icons/accessories/pig_s_foot.png');
      console.log('Successfully saved pigs_foot.png, pig_foot.png, and pig_s_foot.png!');
    });
  }
});


