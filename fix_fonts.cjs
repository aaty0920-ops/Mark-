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
    let replaced = content.replace(/font-kanit/g, '').replace(/font-carter/g, 'font-bold font-sans tracking-tight');
    
    // clean up spaces
    replaced = replaced.replace(/className="\s+/g, 'className="').replace(/\s+"/g, '"');

    if (replaced !== content) {
        fs.writeFileSync(file, replaced);
        console.log('Fixed ' + file);
    }
});
