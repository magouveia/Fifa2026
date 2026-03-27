const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://i.imgur.com/bWWzjGM.png';
const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const file192 = fs.createWriteStream(path.join(publicDir, 'icon-192.png'));
const file512 = fs.createWriteStream(path.join(publicDir, 'icon-512.png'));

https.get(url, (response) => {
  response.pipe(file192);
});

https.get(url, (response) => {
  response.pipe(file512);
});
