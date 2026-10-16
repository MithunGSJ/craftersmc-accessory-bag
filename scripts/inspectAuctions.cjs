const https = require('https');

const API_KEY = '44858bff-1259-457f-905d-514867e3780d';

https.get({
  hostname: 'api.craftersmc.net',
  path: '/v1/skyblock/auctions?page=0',
  headers: {
    'X-API-Key': API_KEY,
    'User-Agent': 'CraftersMC-Auditor'
  }
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Success:', parsed.success);
      console.log('Total auctions:', parsed.totalAuctions);
      console.log('Total pages:', parsed.totalPages);
      console.log('Auctions on page 0:', parsed.auctions?.length);
      if (parsed.auctions && parsed.auctions.length > 0) {
        console.log('Sample auction 0 keys:', Object.keys(parsed.auctions[0]));
        console.log('Sample auction 0:', JSON.stringify(parsed.auctions[0], null, 2));
      }
    } catch (e) {
      console.log('Error parsing:', e.message);
    }
  });
});
