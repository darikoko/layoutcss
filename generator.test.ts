// tests/parser.test.ts
import { describe, it, expect } from 'vitest';
import { createLayoutClass, Utility } from './generator'; // adapte ce chemin si nécessaire

describe('Generator logic', () => {
    it('demo', () => {
        const hey = createLayoutClass("gap:120px")
        expect(hey.name).toBe("gap");
        expect(hey.value).toBe("120px");
    });

    it('demo2', () => {
        const hey = createLayoutClass("gap")
        expect(hey.name).toBe("gap");
        expect(hey.value).toBe(undefined);
    });

});