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

        if (line.includes('border-slate-200') && !line.includes('dark:border') && !line.includes('border-slate-200/')) {
            lines[i] = line.replace(/border-slate-200/g, 'border-slate-200 dark:border-slate-700');
            changed = true;
            line = lines[i];
        }

        if (line.includes('border-slate-300') && !line.includes('dark:border') && !line.includes('border-slate-300/')) {
            lines[i] = line.replace(/border-slate-300/g, 'border-slate-300 dark:border-slate-600');
            changed = true;
            line = lines[i];
        }
    }
    
    if (changed) {
        fs.writeFileSync(file, lines.join('\n'));
        console.log('Fixed ' + file);
    }
});
