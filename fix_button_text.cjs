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
        if (line.includes('bg-brand') || line.includes('bg-gradient-to-') || line.includes('bg-blue-') || line.includes('bg-orange-') || line.includes('bg-emerald-') || line.includes('bg-indigo-') || line.includes('bg-purple-') || line.includes('bg-red-') || line.includes('bg-black') || line.includes('bg-[') || line.includes('bg-slate-900') || line.includes('bg-amber-') || line.includes('bg-teal-')) {
            // Check if it has mistakenly received text-slate-900 dark:text-white instead of just text-white
            if (line.includes('bg-slate-50')) continue; // Skip light mode bg
            if (line.includes('bg-white')) continue;

            let replaced = line.replace(/text-slate-900 dark:text-white(?!\/\d+)/g, 'text-white');
            if (replaced !== line) {
                lines[i] = replaced;
                changed = true;
            }
        }
    }
    
    if (changed) {
        fs.writeFileSync(file, lines.join('\n'));
        console.log('Fixed ' + file);
    }
});
