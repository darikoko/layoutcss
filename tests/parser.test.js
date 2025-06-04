"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests/parser.test.ts
const vitest_1 = require("vitest");
const parser_1 = require("../src/parser"); // adapte ce chemin si nécessaire
(0, vitest_1.describe)('Parser logic', () => {
    (0, vitest_1.it)('read jsx should works', () => {
        const parser = new parser_1.Parser('<div  layout="p:2" onclick={() => {console.log("bb")}} layout400px="pt:3"');
        parser.parse();
        (0, vitest_1.expect)(parser.layoutAttributeValue()).toBe("p:2");
        (0, vitest_1.expect)(parser.layoutBreakpointAttributeValue()).toBe("pt:3");
    });
    (0, vitest_1.it)('reset parser when new tag', () => {
        const parser = new parser_1.Parser('<div layout="p:2"></div> <p layout="bonsoir"');
        parser.parse();
        (0, vitest_1.expect)(parser.tagName()).toBe("p");
    });
    (0, vitest_1.it)('keeps biggest_breakpoint when new_breakpoint < biggest_breakpoint', () => {
        const parser = new parser_1.Parser('slaut');
        parser.biggestBreakpoint = 2000;
        parser.updateBiggestBreakpoint(1200);
        (0, vitest_1.expect)(parser.biggestBreakpoint).toBe(2000);
    });
    (0, vitest_1.it)('updates biggest_breakpoint when new_breakpoint > biggest_breakpoint', () => {
        const parser = new parser_1.Parser('slaut');
        parser.updateBiggestBreakpoint(1200);
        (0, vitest_1.expect)(parser.biggestBreakpoint).toBe(1200);
    });
    (0, vitest_1.it)('extracts tag name correctly', () => {
        const parser = new parser_1.Parser('< div >');
        parser.tagNameStart = 2;
        parser.tagNameEnd = 4;
        (0, vitest_1.expect)(parser.tagName()).toBe('div');
    });
});
(0, vitest_1.describe)('State transitions', () => {
    let parser;
    (0, vitest_1.beforeEach)(() => {
        parser = new parser_1.Parser('');
    });
    (0, vitest_1.it)('ReadingAttributeValue with non-" stays in same state', () => {
        parser.state = parser_1.State.ReadingAttributeValue;
        (0, vitest_1.expect)(parser.transition('i')).toBe(parser_1.State.ReadingAttributeValue);
    });
    (0, vitest_1.it)('ReadingTagName and ReadingAttributeName with alphabetic stay same', () => {
        parser.state = parser_1.State.ReadingTagName;
        (0, vitest_1.expect)(parser.transition('i')).toBe(parser_1.State.ReadingTagName);
        parser.state = parser_1.State.ReadingAttributeName;
        (0, vitest_1.expect)(parser.transition('i')).toBe(parser_1.State.ReadingAttributeName);
    });
    (0, vitest_1.it)('ReadingAttributeValue with " goes to AfterTagName', () => {
        parser.state = parser_1.State.ReadingAttributeValue;
        (0, vitest_1.expect)(parser.transition('"')).toBe(parser_1.State.AfterTagName);
    });
    (0, vitest_1.it)('WaitingAttributeValue with " goes to ReadingAttributeValue', () => {
        parser.state = parser_1.State.WaitingAttributeValue;
        (0, vitest_1.expect)(parser.transition('"')).toBe(parser_1.State.ReadingAttributeValue);
    });
    (0, vitest_1.it)('ReadingAttributeName with = goes to WaitingAttributeValue', () => {
        parser.state = parser_1.State.ReadingAttributeName;
        (0, vitest_1.expect)(parser.transition('=')).toBe(parser_1.State.WaitingAttributeValue);
    });
    (0, vitest_1.it)('ReadingAttributeName with > goes to Resting', () => {
        parser.state = parser_1.State.ReadingAttributeName;
        (0, vitest_1.expect)(parser.transition('>')).toBe(parser_1.State.Resting);
    });
    (0, vitest_1.it)('ReadingTagName with > goes to Resting', () => {
        parser.state = parser_1.State.ReadingTagName;
        (0, vitest_1.expect)(parser.transition('>')).toBe(parser_1.State.Resting);
    });
    (0, vitest_1.it)('Resting with < goes to InsideTag', () => {
        parser.state = parser_1.State.Resting;
        (0, vitest_1.expect)(parser.transition('<')).toBe(parser_1.State.InsideTag);
    });
    (0, vitest_1.it)('Resting with a stays Resting', () => {
        parser.state = parser_1.State.Resting;
        (0, vitest_1.expect)(parser.transition('a')).toBe(parser_1.State.Resting);
    });
    (0, vitest_1.it)('InsideTag with alpha goes to ReadingTagName', () => {
        parser.state = parser_1.State.InsideTag;
        (0, vitest_1.expect)(parser.transition('d')).toBe(parser_1.State.ReadingTagName);
    });
    (0, vitest_1.it)('ReadingTagName with whitespace goes to AfterTagName', () => {
        parser.state = parser_1.State.ReadingTagName;
        (0, vitest_1.expect)(parser.transition(' ')).toBe(parser_1.State.AfterTagName);
        (0, vitest_1.expect)(parser.transition('\n')).toBe(parser_1.State.AfterTagName);
        (0, vitest_1.expect)(parser.transition('\t')).toBe(parser_1.State.AfterTagName);
    });
    (0, vitest_1.it)('AfterTagName with alpha goes to ReadingAttributeName', () => {
        parser.state = parser_1.State.AfterTagName;
        (0, vitest_1.expect)(parser.transition('c')).toBe(parser_1.State.ReadingAttributeName);
    });
    (0, vitest_1.it)('ReadingAttributeName with whitespace goes to AfterTagName', () => {
        parser.state = parser_1.State.ReadingAttributeName;
        (0, vitest_1.expect)(parser.transition(' ')).toBe(parser_1.State.AfterTagName);
    });
    (0, vitest_1.it)('AfterTagName with > goes to Resting', () => {
        parser.state = parser_1.State.AfterTagName;
        (0, vitest_1.expect)(parser.transition('>')).toBe(parser_1.State.Resting);
    });
});
