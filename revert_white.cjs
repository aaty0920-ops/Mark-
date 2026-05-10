const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Revert bg-slate-900/ to bg-white/
      content = content.replace(/bg-slate-900(\/[0-9]+)/g, 'bg-white$1');
      // Revert bg-slate-900/ to bg-white/
      content = content.replace(/bg-slate-900\/(\[[^\]]+\])/g, 'bg-white/$1');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceInDir('./src');
