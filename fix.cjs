const fs = require('fs');
let txt = fs.readFileSync('public/landing-pages/bestsellers-book-showcase.html', 'utf8');

// Fix image path
txt = txt.replace('src="/profile.jpg"', 'src="../profile.jpg"');

// Swap B.Tech CSE and Data Science on the cover so Data Science is the prominent subtitle
txt = txt.replace('<span class="cover-subtitle">B.Tech CSE</span>', '<span class="cover-subtitle">Data Science</span>');
txt = txt.replace('<span class="cover-footer">Data Science</span>', '<span class="cover-footer">B.Tech CSE</span>');

fs.writeFileSync('public/landing-pages/bestsellers-book-showcase.html', txt);
console.log('Fixed path to ../profile.jpg and updated text.');
