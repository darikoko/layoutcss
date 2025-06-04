"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests/parser.test.ts
const vitest_1 = require("vitest");
const generator_1 = require("../src/generator");
const utility_1 = require("../src/utilities/utility");
const center_1 = require("../src/components/center");
// adapte ce chemin si nécessaire
(0, vitest_1.describe)('recursive logic', () => {
    (0, vitest_1.it)('update recursive CSS', () => {
        let css = `[layout~="flex-grow:start"] {
            flex-grow: start;
        }`;
        console.log((0, utility_1.transformRecursive)(css));
        console.log((0, utility_1.transformChild)(css));
    });
});
(0, vitest_1.describe)('generateCss logic', () => {
    (0, vitest_1.it)('create correct object', () => {
        const finalMap = new Map();
        finalMap.set('{ "type": "InferiorOrEqualTo", "size": 500 }', [new center_1.Center(["max-width:300px"])]);
        finalMap.set('{ "type": "InferiorOrEqualTo", "size": 900 }', [new center_1.Center(["max-width:300px"])]);
        finalMap.set('{ "type": "InferiorOrEqualTo", "size": 700 }', [new center_1.Center(["max-width:300px"])]);
        finalMap.set('{ "type": "None" }', [new center_1.Center(["max-width:300px"])]);
        finalMap.set('{ "type": "SuperiorTo", "size": 400 }', [new center_1.Center(["max-width:300px"])]);
        console.log(finalMap.entries());
        const css = (0, generator_1.generateCss)(finalMap, 1.618);
    });
});
(0, vitest_1.describe)('generateElements logic', () => {
    (0, vitest_1.it)('create elements', () => {
        const tagName = 'center-l';
        const layoutAttributeValue = 'p:2 pl-child:3 max-width:350px';
        const elements = (0, generator_1.generateElements)(tagName, layoutAttributeValue, { type: "None" });
    });
});
(0, vitest_1.describe)('createUtility logic', () => {
    (0, vitest_1.it)('create an unknown utility return undefined', () => {
        const pUtility = (0, generator_1.createUtility)("pzdf:4");
        (0, vitest_1.expect)(pUtility).toBe(undefined);
    });
    (0, vitest_1.it)('create a normal utility', () => {
        const pUtility = (0, generator_1.createUtility)("p:4");
        (0, vitest_1.expect)(pUtility).toStrictEqual({
            name: 'p',
            value: '4',
            recursive: false,
            child: false,
        });
    });
    (0, vitest_1.it)('create a child utility', () => {
        const pUtility = (0, generator_1.createUtility)("pl-child:4");
        (0, vitest_1.expect)(pUtility).toStrictEqual({
            name: 'pl',
            value: '4',
            recursive: false,
            child: true,
        });
    });
    (0, vitest_1.it)('create a recursive utility', () => {
        const pUtility = (0, generator_1.createUtility)("pl-recursive:4");
        (0, vitest_1.expect)(pUtility).toStrictEqual({
            name: 'pl',
            value: '4',
            recursive: true,
            child: false,
        });
    });
    (0, vitest_1.it)('create a utility without value', () => {
        const pUtility = (0, generator_1.createUtility)("absolute");
        (0, vitest_1.expect)(pUtility).toStrictEqual({
            name: 'absolute',
            value: undefined,
            recursive: false,
            child: false,
        });
    });
    (0, vitest_1.it)('create a child utility without value', () => {
        const pUtility = (0, generator_1.createUtility)("absolute-child");
        (0, vitest_1.expect)(pUtility).toStrictEqual({
            name: 'absolute',
            value: undefined,
            recursive: false,
            child: true,
        });
    });
    (0, vitest_1.it)('create a rec utility without value', () => {
        const pUtility = (0, generator_1.createUtility)("absolute-recursive");
        (0, vitest_1.expect)(pUtility).toStrictEqual({
            name: 'absolute',
            value: undefined,
            recursive: true,
            child: false,
        });
    });
});
