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
        
        // Skip if its part of bg-gradient or dark:text or text-white
        if (line.includes('bg-brand') || line.includes('bg-blue-')) continue;

        if (line.includes('text-slate-900') && !line.includes('dark:text-white') && !line.includes('dark:text-slate')) {
            lines[i] = line.replace(/text-slate-900/g, 'text-slate-900 dark:text-white');
            changed = true;
            line = lines[i]; // for next
        }

        if (line.includes('text-slate-800') && !line.includes('dark:text-slate') && !line.includes('dark:text-white')) {
            lines[i] = line.replace(/text-slate-800/g, 'text-slate-800 dark:text-slate-200');
            changed = true;
            line = lines[i];
        }
        
        if (line.includes('text-slate-700') && !line.includes('dark:text-slate') && !line.includes('dark:text-white')) {
            lines[i] = line.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-300');
            changed = true;
            line = lines[i];
        }
        
        if (line.includes('text-slate-600') && !line.includes('dark:text-slate') && !line.includes('dark:text-white')) {
            lines[i] = line.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-400');
            changed = true;
            line = lines[i];
        }
        
        if (line.includes('text-slate-500') && !line.includes('dark:text-slate') && !line.includes('dark:text-white')) {
            lines[i] = line.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');
            changed = true;
            line = lines[i];
        }
        
        if (line.includes('text-slate-400') && !line.includes('dark:text-slate-500') && !line.includes('dark:text-slate-600')) {
            // maybe already has a dark variant
        }
    }
    
    if (changed) {
        fs.writeFileSync(file, lines.join('\n'));
        console.log('Fixed ' + file);
    }
});
