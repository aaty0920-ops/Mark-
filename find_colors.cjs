const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
const issues = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        // If the line has 'text-white' but NOT 'dark:text-white' AND NOT 'bg-brand' AND NOT 'bg-blue'...
         if (line.includes('text-white') && !line.includes('dark:text-white') && !line.includes('hover:text-white') && !line.includes('focus:text-white') && !line.includes('active:text-white')) {
            if (!line.includes('bg-') && !line.includes('shadow-white')) {
                 issues.push(`${file}:${index + 1}: ${line.trim()}`);
            }
         }
         
         // OR, if the line has 'text-slate-[12]00' without 'dark:'
         if (line.match(/text-slate-[12]00/) && !line.includes('dark:text-slate')) {
            if (!line.includes('bg-')) {
                 issues.push(`${file}:${index + 1}: ${line.trim()}`);
            }
         }
    });
});

fs.writeFileSync('color_issues.txt', issues.join('\n'));
console.log('Found ' + issues.length + ' issues');
