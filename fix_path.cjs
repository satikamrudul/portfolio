const fs = require('fs');
let txt = fs.readFileSync('public/landing-pages/bestsellers-book-showcase.html', 'utf8');

txt = txt.replace('src="./profile.jpg"', 'src="/profile.jpg"');
fs.writeFileSync('public/landing-pages/bestsellers-book-showcase.html', txt);
console.log('Fixed profile picture path to absolute root.');
