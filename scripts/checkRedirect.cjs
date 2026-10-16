const https = require('https');

const API_KEY = '44858bff-1259-457f-905d-514867e3780d';

https.get({
  hostname: 'api.craftersmc.net',
  path: '/v1/skyblock/bazaar/items',
  headers: { 'X-API-Key': API_KEY, 'User-Agent': 'CraftersMC-Auditor' }
}, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  if (res.headers.location) {
    console.log('Redirect location:', res.headers.location);
  }
});
