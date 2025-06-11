import {describe, it, expect} from 'vitest';
import {createUtility, generateCss, generateElements} from '../src/generator.js';
import {transformChild, transformRecursive, Utility} from "../src/utilities/utility.js";
import {Component} from "../src/components/component.js";
import {Center} from "../src/components/center.js";


describe('recursive logic', () => {
    it('update recursive CSS', () => {

        let css = `[layout~="flex-grow:start"] {
            flex-grow: start;
        }`

        console.log(transformRecursive(css));
        console.log(transformChild(css));
    });


});

describe('generateCss logic', () => {
    it('create correct object', () => {
        const finalMap = new Map<string, (Utility | Component)[]>();
        finalMap.set('{ "type": "InferiorOrEqualTo", "size": 500 }', [new Center(["max-width:300px"])])
        finalMap.set('{ "type": "InferiorOrEqualTo", "size": 900 }', [new Center(["max-width:300px"])])
        finalMap.set('{ "type": "InferiorOrEqualTo", "size": 700 }', [new Center(["max-width:300px"])])
        finalMap.set('{ "type": "None" }', [new Center(["max-width:300px"])])
        finalMap.set('{ "type": "SuperiorTo", "size": 400 }', [new Center(["max-width:300px"])])

        console.log(finalMap.entries());
        const css = generateCss(finalMap, 1.618)
    });


});

describe('generateElements logic', () => {
    it('create elements', () => {
        const tagName = 'center-l'
        const layoutAttributeValue = 'p:2 pl-child:3 max-width:350px'
        const elements = generateElements(tagName, layoutAttributeValue, {type:"None"}, false)

    });


});

describe('createUtility logic', () => {
    it('create an unknown utility return undefined', () => {
        const pUtility = createUtility("pzdf:4")
        expect(pUtility).toBe(undefined);
    });
    it('create a normal utility', () => {
        const pUtility = createUtility("p:4")
        expect(pUtility).toStrictEqual({
            name: 'p',
            value: '4',
            recursive: false,
            child: false,
        });
    });

    it('create a child utility', () => {
        const pUtility = createUtility("pl-child:4")
        expect(pUtility).toStrictEqual({
            name: 'pl',
            value: '4',
            recursive: false,
            child: true,
        });
    });

    it('create a recursive utility', () => {
        const pUtility = createUtility("pl-recursive:4")
        expect(pUtility).toStrictEqual({
            name: 'pl',
            value: '4',
            recursive: true,
            child: false,
        });
    });

    it('create a utility without value', () => {
        const pUtility = createUtility("absolute")
        expect(pUtility).toStrictEqual({
            name: 'absolute',
            value: undefined,
            recursive: false,
            child: false,
        });
    });

    it('create a child utility without value', () => {
        const pUtility = createUtility("absolute-child")
        expect(pUtility).toStrictEqual({
            name: 'absolute',
            value: undefined,
            recursive: false,
            child: true,
        });
    });

    it('create a rec utility without value', () => {
        const pUtility = createUtility("absolute-recursive")
        expect(pUtility).toStrictEqual({
            name: 'absolute',
            value: undefined,
            recursive: true,
            child: false,
        });
    });


});