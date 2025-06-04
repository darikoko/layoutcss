declare abstract class Component {
    abstract getCss(harmonicRatio: number): string[];
    setComponent(layoutClasses: string[]): void;
    camelToKebab(str: string): string;
    getValue(list: string[], className: string): string;
}

declare abstract class Utility {
    child: boolean;
    recursive: boolean;
    value: string;
    abstract getCss(harmonicRatio: number): string[];
    constructor(child: boolean, recursive: boolean, value?: string);
}

type MediaQuery = {
    type: 'SuperiorTo';
    size: number;
    layoutAttributeValue: string;
} | {
    type: 'InferiorOrEqualTo';
    size: number;
} | {
    type: 'None';
};

interface LayoutElementForCss {
    mediaQuery: MediaQuery;
    elements: (Utility | Component)[];
}
/**
 * Generate Css from a layoutMap and a harmonic ratio
 **/
declare function generateCss(layoutMap: Map<string, (Utility | Component)[]>, harmonicRatio: number): string;

declare enum State {
    Resting = "Resting",
    InsideTag = "InsideTag",
    ReadingTagName = "ReadingTagName",
    AfterTagName = "AfterTagName",
    ReadingAttributeName = "ReadingAttributeName",
    WaitingAttributeValue = "WaitingAttributeValue",
    ReadingAttributeValue = "ReadingAttributeValue",
    ReadingJsxAttributeValue = "ReadingJsxAttributeValue"
}
declare class Parser {
    state: State;
    text: string;
    tagNameStart: number | null;
    tagNameEnd: number | null;
    attributeNameStart: number | null;
    attributeNameEnd: number | null;
    layoutAttributeValueStart: number | null;
    layoutAttributeValueEnd: number | null;
    layoutBreakpointAttributeValueStart: number | null;
    layoutBreakpointAttributeValueEnd: number | null;
    biggestBreakpoint: number;
    biggestBreakpointValue: string;
    curlyBracesCounter: number;
    elements: Map<string, (Utility | Component)[]>;
    constructor(text: string);
    sliceText(start: number | null, end: number | null): string;
    tagName(): string;
    attributeName(): string;
    isLayoutAttribute(): boolean;
    isLayoutBreakpointAttribute(): boolean;
    layoutAttributeValue(): string;
    layoutBreakpointAttributeValue(): string;
    resetIndexes(): void;
    updateBiggestBreakpoint(newBreakpoint: number): void;
    extractBreakpoint(): number;
    addElements(elementsInMediaQuery: LayoutElementForCss): void;
    transition(c: string): State;
    parse(): void;
}

export { Parser, generateCss };
