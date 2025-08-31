#!/usr/bin/env node
import { LayoutConfig, loadLayoutConfigFromJson } from "./config.js";
import chokidar from "chokidar";
import { readFile, statSync, writeFile } from 'fs';
import { Parser } from "./parser.js";
import { Component } from "./components/component.js";
import { Utility } from "./utilities/utility.js";
import DEV_CSS from './css/dev.css'
import { generateCss, mergeMapsInPlace } from "./generator.js";
import { transform } from "lightningcss";


function cssProcess(path: string, finalMap: Map<string, (Utility | Component)[]>, config: LayoutConfig) {
    readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const start = performance.now();
        let parser = new Parser(data)
        parser.parse()
        mergeMapsInPlace(finalMap, parser.elements)
        let css = generateCss(finalMap, config.style.harmonicRatio)

        if (config.style.dev) {
            css += DEV_CSS
        }
        css = minifyCss(css);

        const end = performance.now();

        writeFile(config.output.file, css, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
            }
        });

        console.log(`Css Generated in : ${end - start} ms`);
    });
}

function minifyCss(css: string): string {
    const { code } = transform({
        filename: "final.css",
        code: Buffer.from(css),
        minify: true,
    });
    return code.toString();
}

async function main() {
    const finalMap = new Map<string, (Utility | Component)[]>();
    let config = await loadLayoutConfigFromJson()

    const watcher = chokidar.watch(config.input.directory, {
        persistent: true,
        ignored: (path) => {
            // if it's a folder, we don't want to ignore it
            try {
                if (statSync(path).isDirectory()) {
                    return false;
                }
            } catch {
                return false;
            }

            // Ignore files without extensions specified in config
            return !config.input.extensions.some(ext => path.endsWith(`${ext}`));
        },
    });


    watcher.on('add', async (path) => {
        cssProcess(path, finalMap, config);
    });
    watcher.on('change', async (path) => {
        cssProcess(path, finalMap, config);
    });

    const configWatcher = chokidar.watch("./layoutcss.json", {
        persistent: true,
    });
    configWatcher.on('change', async (path) => {
        let config = await loadLayoutConfigFromJson()
        // here we give path as parameter only to reprocess css
        cssProcess(path, finalMap, config);
        console.log("CONFIG CHANGED")
    })


}

main();