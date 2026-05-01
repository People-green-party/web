const https = require('https');
const fs = require('fs');

const url = 'https://upload.wikimedia.org/wikipedia/commons/4/41/Hawa_Mahal_in_Jaipur%2C_India.jpg';
const file = fs.createWriteStream('public/vision/2.png');

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
    if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
            res2.pipe(file);
        });
    } else {
        response.pipe(file);
    }
});
