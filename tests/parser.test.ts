// tests/parser.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Parser, State  } from '../src/parser.js'; // adapte ce chemin si nécessaire



describe('Parser logic', () => {
    it('read / in tag should change state to resting', () => {
        const parser = new Parser('</');
        parser.parse();
        expect(parser.state).toBe(State.Resting);
    });
    it('read jsx should works', () => {
        const parser = new Parser('<div  layout="p:2" onclick={() => {console.log("bb")}} layout400px="pt:3"');
        parser.parse();
        expect(parser.layoutAttributeValue()).toBe("p:2");
        expect(parser.layoutBreakpointAttributeValue()).toBe("pt:3");
    });
    it('reset parser when new tag', () => {
        const parser = new Parser('<div layout="p:2"></div> <p layout="bonsoir"');
        parser.parse();
        expect(parser.tagName()).toBe("p");
    });
    it('keeps biggest_breakpoint when new_breakpoint < biggest_breakpoint', () => {
        const parser = new Parser('slaut');
        parser.biggestBreakpoint = 2000;
        parser.updateBiggestBreakpoint(1200);
        expect(parser.biggestBreakpoint).toBe(2000);
    });

    it('updates biggest_breakpoint when new_breakpoint > biggest_breakpoint', () => {
        const parser = new Parser('slaut');
        parser.updateBiggestBreakpoint(1200);
        expect(parser.biggestBreakpoint).toBe(1200);
    });

    it('extracts tag name correctly', () => {
        const parser = new Parser('< div >');
        parser.tagNameStart = 2;
        parser.tagNameEnd = 4;
        expect(parser.tagName()).toBe('div');
    });
});


describe('State transitions', () => {
    let parser: Parser;

    beforeEach(() => {
        parser = new Parser('');
    });

    it('ReadingAttributeValue with non-" stays in same state', () => {
        parser.state = State.ReadingAttributeValue;
        expect(parser.transition('i')).toBe(State.ReadingAttributeValue);
    });

    it('ReadingTagName and ReadingAttributeName with alphabetic stay same', () => {
        parser.state = State.ReadingTagName;
        expect(parser.transition('i')).toBe(State.ReadingTagName);
        parser.state = State.ReadingAttributeName;
        expect(parser.transition('i')).toBe(State.ReadingAttributeName);
    });

    it('ReadingAttributeValue with " goes to AfterTagName', () => {
        parser.state = State.ReadingAttributeValue;
        expect(parser.transition('"')).toBe(State.AfterTagName);
    });

    it('WaitingAttributeValue with " goes to ReadingAttributeValue', () => {
        parser.state = State.WaitingAttributeValue;
        expect(parser.transition('"')).toBe(State.ReadingAttributeValue);
    });

    it('ReadingAttributeName with = goes to WaitingAttributeValue', () => {
        parser.state = State.ReadingAttributeName;
        expect(parser.transition('=')).toBe(State.WaitingAttributeValue);
    });

    it('ReadingAttributeName with > goes to Resting', () => {
        parser.state = State.ReadingAttributeName;
        expect(parser.transition('>')).toBe(State.Resting);
    });

    it('ReadingTagName with > goes to Resting', () => {
        parser.state = State.ReadingTagName;
        expect(parser.transition('>')).toBe(State.Resting);
    });

    it('Resting with < goes to InsideTag', () => {
        parser.state = State.Resting;
        expect(parser.transition('<')).toBe(State.InsideTag);
    });

    it('Resting with a stays Resting', () => {
        parser.state = State.Resting;
        expect(parser.transition('a')).toBe(State.Resting);
    });

    it('InsideTag with alpha goes to ReadingTagName', () => {
        parser.state = State.InsideTag;
        expect(parser.transition('d')).toBe(State.ReadingTagName);
    });

    it('ReadingTagName with whitespace goes to AfterTagName', () => {
        parser.state = State.ReadingTagName;
        expect(parser.transition(' ')).toBe(State.AfterTagName);
        expect(parser.transition('\n')).toBe(State.AfterTagName);
        expect(parser.transition('\t')).toBe(State.AfterTagName);
    });

    it('AfterTagName with alpha goes to ReadingAttributeName', () => {
        parser.state = State.AfterTagName;
        expect(parser.transition('c')).toBe(State.ReadingAttributeName);
    });

    it('ReadingAttributeName with whitespace goes to AfterTagName', () => {
        parser.state = State.ReadingAttributeName;
        expect(parser.transition(' ')).toBe(State.AfterTagName);
    });

    it('AfterTagName with > goes to Resting', () => {
        parser.state = State.AfterTagName;
        expect(parser.transition('>')).toBe(State.Resting);
    });
});