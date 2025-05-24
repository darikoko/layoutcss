// tests/parser.test.ts
import { describe, it, expect } from 'vitest';
import { Parser, State, transition } from '../src/parser'; // adapte ce chemin si nécessaire



describe('Parser logic', () => {
    it('read jsx should works', () => {
        const parser = new Parser('<div  layout="p:2" onclick={() => {console.log("bb")}}');
        parser.parse();
        expect(parser.layoutAttributeValue()).toBe("p:2");
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
    it('ReadingAttributeValue with non-" stays in same state', () => {
        expect(transition(State.ReadingAttributeValue, 'i')).toBe(State.ReadingAttributeValue);
    });

    it('ReadingTagName and ReadingAttributeName with alphabetic stay same', () => {
        expect(transition(State.ReadingTagName, 'i')).toBe(State.ReadingTagName);
        expect(transition(State.ReadingAttributeName, 'i')).toBe(State.ReadingAttributeName);
    });

    it('ReadingAttributeValue with " goes to AfterTagName', () => {
        expect(transition(State.ReadingAttributeValue, '"')).toBe(State.AfterTagName);
    });

    it('WaitingAttributeValue with " goes to ReadingAttributeValue', () => {
        expect(transition(State.WaitingAttributeValue, '"')).toBe(State.ReadingAttributeValue);
    });

    it('ReadingAttributeName with = goes to WaitingAttributeValue', () => {
        expect(transition(State.ReadingAttributeName, '=')).toBe(State.WaitingAttributeValue);
    });

    it('ReadingAttributeName with > goes to Resting', () => {
        expect(transition(State.ReadingAttributeName, '>')).toBe(State.Resting);
    });

    it('ReadingTagName with > goes to Resting', () => {
        expect(transition(State.ReadingTagName, '>')).toBe(State.Resting);
    });

    it('Resting with < goes to InsideTag', () => {
        expect(transition(State.Resting, '<')).toBe(State.InsideTag);
    });

    it('Resting with a stays Resting', () => {
        expect(transition(State.Resting, 'a')).toBe(State.Resting);
    });

    it('InsideTag with alpha goes to ReadingTagName', () => {
        expect(transition(State.InsideTag, 'd')).toBe(State.ReadingTagName);
    });

    it('ReadingTagName with whitespace goes to AfterTagName', () => {
        expect(transition(State.ReadingTagName, ' ')).toBe(State.AfterTagName);
        expect(transition(State.ReadingTagName, '\n')).toBe(State.AfterTagName);
        expect(transition(State.ReadingTagName, '\t')).toBe(State.AfterTagName);
    });

    it('AfterTagName with alpha goes to ReadingAttributeName', () => {
        expect(transition(State.AfterTagName, 'c')).toBe(State.ReadingAttributeName);
    });

    it('ReadingAttributeName with whitespace goes to AfterTagName', () => {
        expect(transition(State.ReadingAttributeName, ' ')).toBe(State.AfterTagName);
    });

    it('AfterTagName with > goes to Resting', () => {
        expect(transition(State.AfterTagName, '>')).toBe(State.Resting);
    });
});