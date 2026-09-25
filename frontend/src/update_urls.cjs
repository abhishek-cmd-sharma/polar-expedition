const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const configPath = path.join(baseDir, 'config.js');

fs.writeFileSync(configPath, "export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';\n", 'utf8');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk(baseDir);

files.forEach(file => {
    if (file === configPath || file === __filename) return;
    
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('http://localhost:5000')) {
        const depth = file.replace(baseDir, '').split(path.sep).length - 2;
        const rel = depth > 0 ? '../'.repeat(depth) + 'config' : './config';
        
        const importStmt = `import { API_BASE_URL } from '${rel}';\n`;
        
        content = content.replace(/'http:\/\/localhost:5000/g, '`${API_BASE_URL}');
        content = content.replace(/http:\/\/localhost:5000'/g, '${API_BASE_URL}`');
        content = content.replace(/`http:\/\/localhost:5000/g, '`${API_BASE_URL}');
        
        content = content.replace(/io\(`\$\{API_BASE_URL\}`\)/g, 'io(API_BASE_URL)');
        
        fs.writeFileSync(file, importStmt + content, 'utf8');
    }
});
console.log('Update complete.');
