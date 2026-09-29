const fs = require('fs');
let txt = fs.readFileSync('public/landing-pages/bestsellers-book-showcase.html', 'utf8');

const oldBrand = '<a class="brand" href="#" aria-label="Portfolio home">Mrudul Satika</a>';
const newBrand = `<a class="brand" href="#" aria-label="Portfolio home" style="display: flex; align-items: center; gap: 14px; text-decoration: none;">
        <img src="./profile.jpg" alt="Mrudul Satika" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--pink); box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
        <span style="margin-top: 2px;">Mrudul Satika</span>
      </a>`;

if (txt.includes(oldBrand)) {
  txt = txt.replace(oldBrand, newBrand);
  fs.writeFileSync('public/landing-pages/bestsellers-book-showcase.html', txt);
  console.log('Successfully added profile picture to HTML header.');
} else {
  console.log('Could not find the exact brand tag to replace. Searching for fallback...');
  // Fallback search
  const fallback = txt.match(/<a class="brand" href="#" [^>]+>.*?<\/a>/);
  if (fallback) {
    txt = txt.replace(fallback[0], newBrand);
    fs.writeFileSync('public/landing-pages/bestsellers-book-showcase.html', txt);
    console.log('Successfully replaced via fallback regex.');
  } else {
    console.log('Fallback also failed.');
  }
}
