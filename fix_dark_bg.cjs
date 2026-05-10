const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules')) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let changed = false;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line.includes('bg-brand') || line.includes('bg-blue-')) continue;

        if (line.includes('bg-white') && !line.includes('dark:bg') && !line.includes('bg-white/')) {
            lines[i] = line.replace(/bg-white/g, 'bg-white dark:bg-slate-900');
            changed = true;
            line = lines[i];
        }

        if (line.includes('bg-slate-50') && !line.includes('dark:bg') && !line.includes('bg-slate-50/')) {
            lines[i] = line.replace(/bg-slate-50(?!0)/g, 'bg-slate-50 dark:bg-slate-800');
            changed = true;
            line = lines[i];
        }

        if (line.includes('bg-slate-100') && !line.includes('dark:bg') && !line.includes('bg-slate-100/')) {
            lines[i] = line.replace(/bg-slate-100/g, 'bg-slate-100 dark:bg-slate-800');
            changed = true;
            line = lines[i];
        }
    }
    
    if (changed) {
        fs.writeFileSync(file, lines.join('\n'));
        console.log('Fixed ' + file);
    }
});
