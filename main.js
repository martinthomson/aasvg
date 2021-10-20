#!/usr/bin/env node
const { diagramToSVG } = require('./markdeep-diagram.js');
const VERSION = "aasvg 0.1.0";

async function read() {
    let input = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
        let chunk;
        // Use a loop to make sure we read all available data.
        while ((chunk = process.stdin.read()) !== null) {
            input += chunk.replace(/\r/g, '');
        }
    });
    return await new Promise((resolve, reject) => {
        process.stdin.on('end', () => {
            resolve(input);
        });
        process.stdin.on('error', e => {
            reject(e);
        });
    });
}

(async function main() {
    let options = {};
    process.argv.slice(2).forEach(a => {
        if (a === '--text-grid') {
            options.textGrid = true;
        } else if (a === '--disable-text') {
            options.disableText = true;
        } else if (a === '--show-grid') {
            options.showGrid = true;
        } else if (a === "--version") {
            console.log(VERSION);
            process.exit();
        } else {
            console.warn("Turn ASCII art into SVG");
            console.warn();
            console.warn("Usage: aasvg [options] < {text} > {svg}");
            console.warn();
            console.warn("    --disable-text  Disable simple text");
            console.warn("    --show-grid     Draw a grid (debugging)");
            console.warn("    --text-grid     Render text in a grid");
            console.warn("    --version       Show the version and exit");
            process.exit(2);
        }
    })
    const txt = await read();
    const svg = diagramToSVG(txt, options);
    console.log(svg);
})();
