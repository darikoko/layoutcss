#!/usr/bin/env node
import {LayoutConfig, loadLayoutConfigFromJson} from "./config";
import chokidar from "chokidar";
import {readFile, statSync, writeFile} from 'fs';
import {Parser} from "./parser";
import {Component} from "./components/component";
import {Utility} from "./utilities/utility";
import {DEV_CSS, generateCss, mergeMapsInPlace} from "./generator";




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
        if (config.style.dev){
            css += DEV_CSS
        }
        if (config.output.minify){
            //TODO find a lib to minify css
        }
        const end = performance.now();

        writeFile(config.output.file, css, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
            }
        });

        console.log(`Css Generated in : ${end - start} ms`);
    });
}

async function main() {
    const finalMap = new Map<string, (Utility | Component)[]>();
    let config = await loadLayoutConfigFromJson()

    const watcher = chokidar.watch('./src', {
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
        console.log("CONFIG CHANGE")
    })


}

/*
main().catch(err => {
    console.error("❌ An error has happened", err);
});
*/

// Exécuter main() seulement si le fichier est appelé directement
if (require.main === module) {
    main();
}