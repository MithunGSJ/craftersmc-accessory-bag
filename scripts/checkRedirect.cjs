const https = require('https');

const API_KEY = process.env.CRAFTERS_API_KEY || '';

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
