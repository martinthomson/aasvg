#!/usr/bin/env node
const { diagramToSVG } = require('./markdeep-diagram.js');
const VERSION = "aasvg 0.1.6";

function usage() {
    console.warn("Turn ASCII art into SVG");
    console.warn();
    console.warn("Usage: aasvg [options] < <text> > <svg>");
    console.warn();
    console.warn("    --disable-text    Disable simple text");
    console.warn("    --grid            Draw a grid (debugging)");
    console.warn("    --spaces=<n>      Split text after <n> spaces");
    console.warn("                      (0 means place every character separately)");
    console.warn("    --stretch         Stretch text to better fit it")
    console.warn("                      (use with --spaces > 0; uses advanced SVG)");
    console.warn("    --backdrop        Draw a backdrop");
    console.warn("    --<attr>=<value>  Set SVG attribute <attr> to <value>");
    console.warn("    --version         Show the version and exit");
    process.exit(2);
}

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
    let options = { style: {} };
    process.argv.slice(2).forEach(a => {
        if (a === '--disable-text') {
            options.disableText = true;
        } else if (a === '--grid') {
            options.grid = true;
        } else if (a === '--stretch') {
            options.stretch = true;
        } else if (a === '--backdrop') {
            options.backdrop = true;
        } else if (a === "--version") {
            console.log(VERSION);
            process.exit();
        } else if (a.startsWith("--spaces=")) {
            options.spaces = parseInt(a.substring(9), 10);
        } else {
            let s = a.substring(2).split('=');
            if (a.substring(0, 2) === '--' && s.length === 2) {
                options.style[s[0]] = s[1];
            } else {
                usage();
            }
        }
    })
    const txt = await read();
    const svg = diagramToSVG(txt, options);
    console.log(svg);
})();
