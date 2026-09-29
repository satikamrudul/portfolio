const fs = require('fs');
let txt = fs.readFileSync('public/landing-pages/bestsellers-book-showcase.html', 'utf8');

const replacement = `const books = {
        codex: {
          title: 'Academic Journey',
          year: '2026',
          description: 'Currently pursuing my B.Tech in Computer Science with a specialization in Data Science at Nalla Narasimha Reddy Education Society Group of Institutions.',
          steps: [
            { title: 'Core CS', body: 'Developing a strong foundation in core CS subjects and software engineering principles.' },
            { title: 'Specialization', body: 'Focusing heavily on Data Science, statistical modeling, and analytical programming.' },
            { title: 'Extracurriculars', body: 'Active participant in technical projects and hackathons.' },
            { title: 'Philosophy', body: '\\'Learning by Building\\' is my primary approach to mastering new concepts.' }
          ],
          prompt: 'Ready to graduate and apply academic knowledge to real-world data problems.',
          review: 'Consistent track record of building and learning simultaneously.'
        },
        claude: {
          title: 'Technical Stack',
          year: '2024',
          description: 'Languages: Java, Python, JavaScript. Technologies: React, Data Science Libraries (Pandas, NumPy), Edge AI. Tools: Git, GitHub, VS Code.',
          steps: [
            { title: 'Languages', body: 'Fluent in Java, Python, and web fundamentals (JS/HTML/CSS).' },
            { title: 'Data Science', body: 'Proficient with Pandas, NumPy, Scikit-learn, and building ML models.' },
            { title: 'Web Dev', body: 'Building interactive frontend experiences with React and Vite.' },
            { title: 'Tools', body: 'Comfortable with Git workflows, IDEs like VS Code, and terminal environments.' }
          ],
          prompt: 'Always eager to pick up new tools and frameworks for the task at hand.',
          review: 'Combining data-heavy backend logic with smooth frontend interfaces.'
        },
        cursor: {
          title: 'Recent Work',
          year: '2023-2026',
          description: 'Practical applications built during hackathons and personal deep-dives. Passionate about applying Data Science and Software Engineering.',
          steps: [
            { title: 'Predictive Analytics', body: 'Data Science predictive models utilizing machine learning algorithms.' },
            { title: 'Interactive Web', body: 'Interactive web applications, including fully 3D integrated portfolios.' },
            { title: 'Edge AI', body: 'Exploring and developing solutions utilizing Edge AI paradigms.' },
            { title: 'Hackathons', body: 'Constantly challenging myself to build creative solutions under pressure.' }
          ],
          prompt: 'Contact me at +91 8500661847 or connect on LinkedIn (mrudul-satika-30aab7439).',
          review: 'I believe the best way to master a skill is by applying it to real-world problems.'
        }
      };`;

txt = txt.replace(/const books = \{[\s\S]*?(?=\n\s+const body =)/, replacement);
fs.writeFileSync('public/landing-pages/bestsellers-book-showcase.html', txt);
console.log("Updated HTML data");
