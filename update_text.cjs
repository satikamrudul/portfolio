const fs = require('fs');
let txt = fs.readFileSync('public/landing-pages/bestsellers-book-showcase.html', 'utf8');

txt = txt.replace(/Field Manual  I/g, 'Chapter I');
txt = txt.replace(/Field Manual  II/g, 'Chapter II');
txt = txt.replace(/Field Manual  III/g, 'Chapter III');
txt = txt.replace(/The Augmented Editor/g, 'Learning by Building');

// In case encoding was funny:
txt = txt.replace(/Field Manual .*? I</g, 'Chapter I<');
txt = txt.replace(/Field Manual .*? II</g, 'Chapter II<');
txt = txt.replace(/Field Manual .*? III</g, 'Chapter III<');

fs.writeFileSync('public/landing-pages/bestsellers-book-showcase.html', txt);
console.log("Fixed subtitles and kickers.");
