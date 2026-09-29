const fs = require('fs');
let txt = fs.readFileSync('public/landing-pages/bestsellers-book-showcase.html', 'utf8');

txt = txt.replace('Getting started', 'Details & Highlights');
txt = txt.replace('Your first prompt', 'Current Focus');
txt = txt.replace('Before you ship', 'Key Takeaway');
txt = txt.replace('Field edition and publication year', 'Portfolio Information');
txt = txt.replace('Field Notes', 'Portfolio Notes');

fs.writeFileSync('public/landing-pages/bestsellers-book-showcase.html', txt);
console.log('Fixed hardcoded detail panel labels.');
