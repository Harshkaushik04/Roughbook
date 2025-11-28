const fs = require('fs');
const path = require('path');

const inputFile = 'client.js';
const outputFile = 'new_client.js';

// Check if client.js exists
if (!fs.existsSync(inputFile)) {
    console.error(`Error: ${inputFile} not found in the current directory.`);
    process.exit(1);
}

console.log(`Reading ${inputFile}...`);
let code = fs.readFileSync(inputFile, 'utf8');

let count = 0;

// 1. Match standard named functions: "async function name(args) {"
// Captures: group 1 (async keyword or undefined), group 2 (function name), group 3 (arguments)
code = code.replace(/(async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*\{/g, (match, asyncKeyword, funcName, args) => {
    count++;
    const asyncStr = asyncKeyword || '';
    return `${asyncStr}function ${funcName}(${args}) {\n    console.log('Function called: ${funcName}');`;
});

// 2. Match variable assigned arrow/anonymous functions: "const name = async (args) => {"
// Captures: group 1 (const/let), group 2 (variable name), group 3 (async keyword), group 4 (arguments)
code = code.replace(/(const|let|var)\s+(\w+)\s*=\s*(async\s*)?(\([^)]*\)|[^=]+)\s*=>\s*\{/g, (match, decl, funcName, asyncKeyword, args) => {
    count++;
    const asyncStr = asyncKeyword || '';
    return `${decl} ${funcName} = ${asyncStr}${args} => {\n    console.log('Function called: ${funcName}');`;
});

// 3. Write the result
fs.writeFileSync(outputFile, code);

console.log(`Success! injected logs into ${count} functions.`);
console.log(`Generated file: ${outputFile}`);