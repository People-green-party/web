const http = require('http');

const u = 'pgpparty';
const p = 'acc04c50fcXX';
const mob = '+919636605727';
// Note: IT Infotech requires exact match. Screenshot says format is: "{#var#} is your verification code for People's Green Party."
const msg = "123456 is your verification code for People's Green Party.";
const url = `http://sms.indiaitinfotech.com/sendsms.jsp?user=${u}&password=${p}&senderid=IPGPTY&mobiles=${encodeURIComponent(mob).replace('%2B', '')}&sms=${encodeURIComponent(msg)}&entityid=1701165113133141933&tempid=1707177217726034212&accusage=1&unicode=1`;

http.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Result:', data));
});
