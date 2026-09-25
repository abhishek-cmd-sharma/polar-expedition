const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

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
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix mismatched quotes: starts with `${API_BASE_URL} and ends with '
    // Regex matches: ` ${API_BASE_URL} followed by anything that is NOT a quote, ending in a single quote.
    const newContent = content.replace(/(`\$\{API_BASE_URL\}[^']*)'/g, '$1`');
    
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
    }
});
console.log('Quote fix complete.');
