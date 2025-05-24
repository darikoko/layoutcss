import {loadLayoutConfigFromJson} from "./config";
import chokidar from "chokidar";
import {readFile, readFileSync, statSync, writeFile} from 'fs';
import {Parser} from "./parser";
import {Component} from "./components/component";
import {Utility} from "./utilities/utility";
import {cmpMediaQuery, MediaQuery} from "./media-query";
import {LayoutConfig} from "./config";

type LayoutElementMap = Map<string, (Utility | Component)[]>;

const RESET_CSS = readFileSync('./src/css/reset.css', { encoding: 'utf8' });

export function transformRecursive(str: string): string {
    const updated = str.replace(/="([^":]+)(?=(:|"))/, '="$1-recursive');
    return updated.replace('"]', '"] *');
}

export function transformChild(str: string): string {
    const updated = str.replace(/="([^":]+)(?=(:|"))/, '="$1-child');
    return updated.replace('"]', '"] > *');
}


function mergeMapsInPlace(target: LayoutElementMap, source: LayoutElementMap) {
    for (const [key, value] of source) {
        const existing = target.get(key);
        if (existing) {
            existing.push(...value); // on modifie le tableau en place
        } else {
            target.set(key, value); // pas de copie ici non plus
        }
    }
}

export function generateCss(layoutMap: Map<string, (Utility | Component)[]>, harmonicRatio:number):string{
    const sortedList = Array.from(layoutMap.entries()).map(([key, value]) => ({
            mediaQuery : JSON.parse(key) as MediaQuery,
            values: value
        })).sort((a, b) => cmpMediaQuery(a.mediaQuery, b.mediaQuery));
    console.log(sortedList);
    let cssRules: string[] = [RESET_CSS]
    for (const group of sortedList) {
        let css: string[] = []
        for (const layoutElement of group.values) {
           css = layoutElement.getCss(harmonicRatio)
            if(layoutElement instanceof Utility && layoutElement.child) {
                css.map(transformChild)
            }
            else if(layoutElement instanceof Utility && layoutElement.recursive) {
                css.map(transformRecursive)
            }
        }
        if(group.mediaQuery.type === "InferiorOrEqualTo") {
            cssRules.push(`@media (width <= ${group.mediaQuery.size}px) { ${css.join('')} }`)
        }
        else if(group.mediaQuery.type === "SuperiorTo") {
            cssRules.push(`@media (width > ${group.mediaQuery.size}px) { ${css.join('')} }`)
        }

    }
    console.log(cssRules.join('\n'))
    return cssRules.join("\n")
}

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
        const css = generateCss(finalMap, config.style.harmonicRatio)
        const end = performance.now();

        writeFile(config.output.file, css, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
            }
            console.log('File written successfully!');
        });

        console.log(`Temps écoulé : ${end - start} ms`);
    });
}

async function main() {
    const finalMap = new Map<string, (Utility | Component)[]>();
    const config = await loadLayoutConfigFromJson()

    const watcher = chokidar.watch('./src', {
        persistent: true,
        ignored: (path) => {
            // Si c'est un dossier, ne pas ignorer
            try {
                if (statSync(path).isDirectory()) {
                    return false;
                }
            } catch {
                // Si erreur, ignore pas (prudent)
                return false;
            }

            // Ignore les fichiers sans extension dans la liste autorisée
            return !config.input.extensions.some(ext => path.endsWith(`${ext}`));
        },
    });


    watcher.on('add', async (path) => {
        cssProcess(path, finalMap, config);
    });
    watcher.on('change', async (path) => {
        cssProcess(path, finalMap, config);
    });
    watcher.on('unlink', path => console.log(`File ${path} has been removed`));


}

main().catch(err => {
    console.error("❌ Une erreur est survenue :", err);
});