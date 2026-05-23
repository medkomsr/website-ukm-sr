const fs = require('fs');
const path = require('path');
const dir = 'f:/Project/WebProgramming/RealProject/web-ukm-sr/sanity/queries';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove "use cache" from anywhere in the file that isn't inside a block (simplistic, just removes all "use cache" matches first)
  // Actually, just remove it from the start of lines
  content = content.replace(/^"use cache";?\r?\n/gm, '');
  content = content.replace(/^'use cache';?\r?\n/gm, '');
  
  // Remove existing "use cache" inside functions to avoid duplicates
  content = content.replace(/^\s*"use cache";?\r?\n/gm, '');
  content = content.replace(/^\s*'use cache';?\r?\n/gm, '');
  
  // Inject "use cache" into every exported async function
  content = content.replace(/(export\s+async\s+function\s+\w+\s*\([^)]*\)(?:\s*:\s*Promise<[^>]+>)?\s*\{(?:\r?\n))/g, '$1  "use cache"\n');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${file}`);
});
