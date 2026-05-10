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
        if (line.includes('bg-brand') && line.includes('text-slate-900') && line.includes('dark:text-white')) {
            issues.push(`${file}:${index + 1}: ${line.trim()}`);
        }
    });
});

fs.writeFileSync('brand_issues.txt', issues.join('\n'));
console.log('Found ' + issues.length + ' issues');
