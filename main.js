#!/usr/bin/env node
import { diagramToSVG } from "./text2svg.js";
const VERSION = "aasvg 0.5.2";

function usage(help) {
    console.warn(VERSION + ": Turn ASCII art into SVG");
    console.warn();
    console.warn("Usage: aasvg [options] < <text> > <svg>");
    console.warn();
    console.warn("    spaces=<n>      Split text after <n> spaces [default: 2]");
    console.warn("                    (0 means place every character separately)");
    console.warn("    scale=<n>       Pixels per character [default: 8]");
    console.warn("    aspect=<n>      Vertical scale multiplier [default: 2]");
    console.warn("    stroke=<n>      Line stroke width in SVG pixels [default: 1]");
    console.warn("    stretch         Stretch text to better fit it")
    console.warn("                    (use with spaces > 0; uses advanced SVG)");
    console.warn("    fill            Omit width and height attributes");
    console.warn("    width=<n>       Set the viewbox width to <n> characters");
    console.warn("    height=<n>      Set the viewbox height to <n> characters");
    console.warn("    arrow=<style>   Arrowhead style: solid (default) or line");
    console.warn("    <attr>=<value>  Set SVG attribute <attr> to <value>");
    console.warn("    backdrop        Draw a backdrop");
    console.warn();
    console.warn("    embed           Embed input in the SVG");
    console.warn("    extract         Extract embedded input from the SVG (requires xmllint)");
    console.warn();
    console.warn("    disable-text    Disable simple text");
    console.warn("    grid            Draw a grid (debugging)");
    console.warn("    source          Draw an overlay with source text");
    console.warn("    compatible      Disable dark mode for compatibility");
    console.warn();
    console.warn("    version         Display version information and exit");
    console.warn("    help            Show this message and exit");
    process.exit(help ? 0 : 2);
}

async function read() {
    let input = "";
    let src = process.stdin;

    src.setEncoding("utf8");
    src.on("readable", () => {
        let chunk;
        // Use a loop to make sure we read all available data.
        while ((chunk = process.stdin.read()) !== null) {
            input += chunk.replace(/\r/g, "");
        }
    });
    return await new Promise((resolve, reject) => {
        src.on("end", () => {
            resolve(input);
        });
        src.on("error", e => {
            reject(e);
        });
    });
}

function extract(txt) {
    // Rely on the fact that the code has a specific form for embeds.
    let keep = false;
    return txt.split("\n").filter(line => {
        if (/^<text class="ascii"[^>]*><!\[CDATA\[$/.test(line)) {
            keep = true;
            return false;
        } else if (/^\]\]><\/text>$/.test(line)) {
            keep = false;
        }
        return keep;
    }).join("\n");
}

function i(o, a) {
    let v = parseInt(a.substring(o.length + 1), 10);
    if (isNaN(v)) {
        console.warn(`Invalid value for ${o} option`);
        process.exit(2);
    }
    return v;
}

function f(o, a) {
    let v = parseFloat(a.substring(o.length + 1));
    if (isNaN(v) || v <= 0) {
        console.warn(`Invalid value for ${o} option (must be a positive number)`);
        process.exit(2);
    }
    return v;
}

(async function main() {
    let options = { style: {} };
    process.argv.slice(2).forEach(arg => {
        let a = arg.startsWith("--") ? arg.substring(2) : arg;
        if (a === "disable-text") {
            options.disableText = true;
        } else if (a === "grid") {
            options.grid = true;
        } else if (a === "stretch") {
            options.stretch = true;
        } else if (a === "backdrop") {
            options.backdrop = true;
        } else if (a === "source") {
            options.source = true;
        } else if (a === "fill") {
            options.fill = true;
        } else if (a === "compatible") {
            options.compatible = true;
        } else if (a.startsWith("arrow=")) {
            let v = a.substring("arrow=".length);
            if (v !== 'solid' && v !== 'line') {
                console.warn(`Invalid value for arrow option (must be solid or line)`);
                process.exit(2);
            }
            options.arrow = v;
        } else if (a === "embed") {
            options.embed = true;
        } else if (a === "extract") {
            options.extract = true;
        } else if (a.startsWith("width=")) {
            options.width = i("width", a);
        } else if (a.startsWith("height=")) {
            options.height = i("height", a);
        } else if (a.startsWith("spaces=")) {
            options.spaces = i("spaces", a);
        } else if (a.startsWith("scale=")) {
            options.scale = f("scale", a);
        } else if (a.startsWith("aspect=")) {
            options.aspect = f("aspect", a);
        } else if (a.startsWith("stroke=")) {
            options.strokeWidth = f("stroke", a);
        } else if (a === "version") {
            console.log(VERSION);
            process.exit();
        } else if (a === "help") {
            usage(true);
        } else {
            let s = a.split("=");
            if (s.length === 2) {
                options.style[s[0]] = s[1];
            } else {
                usage();
            }
        }
    })
    const txt = await read(options);
    const svg = diagramToSVG((options.extract) ? extract(txt) : txt, options);
    console.log(svg);
})();
