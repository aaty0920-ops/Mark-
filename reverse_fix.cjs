const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, files);
    } else if (filePath.match(/\.(ts|tsx|js|jsx)$/)) {
      files.push(filePath);
    }
  }
  return files;
}

const files = getFiles('src');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  content = content.replace(/bg-slate-900(\/[0-9]+)? dark:bg-slate-[0-9]+(\/[0-9]+)?/g, 'bg-white$1 dark:bg-slate-900$2');
  content = content.replace(/bg-slate-800(\/[0-9]+)? dark:bg-slate-[0-9]+(\/[0-9]+)?/g, 'bg-white$1 dark:bg-slate-900$2');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Modified', file);
  }
}

