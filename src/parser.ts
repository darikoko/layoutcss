import { generateElements, LayoutElementForCss } from "./generator.js";
import {Component} from "./components/component.js";
import {Utility} from "./utilities/utility.js";
import {MediaQuery} from "./media-query.js";

export enum State {
    Resting = "Resting",
    InsideTag = "InsideTag",
    ReadingTagName = "ReadingTagName",
    AfterTagName = "AfterTagName",
    ReadingAttributeName = "ReadingAttributeName",
    WaitingAttributeValue = "WaitingAttributeValue",
    ReadingAttributeValue = "ReadingAttributeValue",
    ReadingJsxAttributeValue = "ReadingJsxAttributeValue"
}

export class Parser {
    state: State = State.Resting;
    text: string;

    tagNameStart: number | null = null;
    tagNameEnd: number | null = null;
    attributeNameStart: number | null = null;
    attributeNameEnd: number | null = null;
    layoutAttributeValueStart: number | null = null;
    layoutAttributeValueEnd: number | null = null;
    layoutBreakpointAttributeValueStart: number | null = null;
    layoutBreakpointAttributeValueEnd: number | null = null;
    biggestBreakpoint: number = 0;
    biggestBreakpointValue: string = "";
    curlyBracesCounter : number = 0;

    elements: Map<string, (Utility | Component)[]> = new Map();

    constructor(text: string) {
        this.text = text;
    }

    sliceText(start: number | null, end: number | null): string {
        if (start === null || end === null || start > end) return "";
        return this.text.slice(start, end + 1);
    }

    tagName(): string {
        return this.sliceText(this.tagNameStart, this.tagNameEnd);
    }

    attributeName(): string {
        return this.sliceText(this.attributeNameStart, this.attributeNameEnd);
    }

    isLayoutAttribute(): boolean {
        return this.attributeName() === "layout";
    }

    isLayoutBreakpointAttribute(): boolean {
        return this.attributeName().startsWith("layout");
    }

    layoutAttributeValue(): string {
        return this.sliceText(this.layoutAttributeValueStart, this.layoutAttributeValueEnd);
    }

    layoutBreakpointAttributeValue(): string {
        return this.sliceText(this.layoutBreakpointAttributeValueStart, this.layoutBreakpointAttributeValueEnd);
    }

    resetIndexes(): void {
        this.tagNameStart = null;
        this.tagNameEnd = null;
        this.attributeNameStart = null;
        this.attributeNameEnd = null;
        this.layoutAttributeValueStart = null;
        this.layoutAttributeValueEnd = null;
        this.layoutBreakpointAttributeValueStart = null;
        this.layoutBreakpointAttributeValueEnd = null;
        this.biggestBreakpoint = 0;
        this.biggestBreakpointValue = "";
        this.curlyBracesCounter = 0;
    }


    updateBiggestBreakpoint(newBreakpoint: number): void {
        if (newBreakpoint <= this.biggestBreakpoint) return;
        this.biggestBreakpoint = newBreakpoint;
        this.biggestBreakpointValue = this.layoutBreakpointAttributeValue();
    }

    extractBreakpoint(): number {
        const attributeName = this.attributeName();
        if (attributeName.length < "layout".length + 3) return 0;
        const slice = attributeName.slice(6, attributeName.length - 2);
        const parsed = parseInt(slice, 10);
        return isNaN(parsed) ? 0 : parsed;
    }

    addElements(elementsInMediaQuery: LayoutElementForCss) {
        if (elementsInMediaQuery.elements.length === 0) {return}
        const key = JSON.stringify(elementsInMediaQuery.mediaQuery)
        if (this.elements.has(key)) {
            this.elements.get(key)!.push(...elementsInMediaQuery.elements);
        } else {
            // Clé n'existe pas, on crée une nouvelle liste avec les éléments
            this.elements.set(key, [...elementsInMediaQuery.elements]);
        }

    }


    transition(c: string): State {
        if (this.state === State.Resting && c === '<') return State.InsideTag;
        if (this.state === State.InsideTag && c === '/') return State.Resting;
        if (this.state === State.InsideTag && /[a-zA-Z]/.test(c)) return State.ReadingTagName;
        if ((this.state === State.ReadingTagName || this.state === State.ReadingAttributeName) && /\s/.test(c)) return State.AfterTagName;
        if (this.state === State.AfterTagName && /[a-zA-Z]/.test(c)) return State.ReadingAttributeName;
        if (this.state === State.ReadingAttributeName && c === '=') return State.WaitingAttributeValue;
        if (this.state === State.WaitingAttributeValue && c === '"') return State.ReadingAttributeValue;
        if (this.state === State.WaitingAttributeValue && c === '{') {
            this.curlyBracesCounter += 1;
            return State.ReadingJsxAttributeValue
        }
        if (this.state === State.ReadingJsxAttributeValue && c === '{') {
            this.curlyBracesCounter += 1;
        }
        if (this.state === State.ReadingJsxAttributeValue && c === '}') {
            this.curlyBracesCounter -= 1;
            if (this.curlyBracesCounter === 0){
                return State.AfterTagName
            }
        }
        if (this.state === State.WaitingAttributeValue && c !== '"') return State.AfterTagName;
        if (this.state === State.ReadingAttributeValue && c === '"') return State.AfterTagName;
        if ((this.state === State.AfterTagName || this.state === State.ReadingTagName || this.state === State.ReadingAttributeName) && c === '>') {
            return State.Resting;
        }
        return this.state;
    }

    parse(): void {
        for (let i = 0; i < this.text.length; i++) {
            const c = this.text[i];
            const newState = this.transition(c);
            if (this.state === newState) continue;

            if (newState === State.ReadingTagName) {
                this.tagNameStart = i;
            } else if (this.state === State.ReadingTagName && newState === State.AfterTagName) {
                this.tagNameEnd = i - 1;
            } else if (newState === State.ReadingAttributeName) {
                this.attributeNameStart = i;
            } else if (
                this.state === State.ReadingAttributeName &&
                (newState === State.WaitingAttributeValue)
            ) {
                this.attributeNameEnd = i - 1;
            } else if (newState === State.ReadingAttributeValue) {
                if (this.isLayoutAttribute()) {
                    this.layoutAttributeValueStart = i + 1;
                } else if (this.isLayoutBreakpointAttribute()) {
                    this.layoutBreakpointAttributeValueStart = i + 1;
                }
            }
            else if (this.state === State.ReadingAttributeValue && newState === State.AfterTagName) {
                if (this.isLayoutAttribute()) {
                    this.layoutAttributeValueEnd = i - 1;
                } else if (this.isLayoutBreakpointAttribute()) {
                    this.layoutBreakpointAttributeValueEnd = i - 1;
                    const bp = this.extractBreakpoint();
                    this.updateBiggestBreakpoint(bp);
                    const mq: MediaQuery = {type: "InferiorOrEqualTo", size: bp}
                    const elements = generateElements(this.tagName(), this.layoutBreakpointAttributeValue(), mq)
                    this.addElements(elements)
                }
            } else if (newState === State.Resting) {
                if (this.state === State.ReadingTagName) {
                    this.tagNameEnd = i - 1;
                }
                // here we generate the elements for the regular layout attribute,
                // if there is one, (in some case we juste have <box-l>...</box-l> without layout attribute)
                // if we have a layout attribute, the element has already been created when leaving the layout attribute
                console.log(this.layoutAttributeValue(), "dfffff", this.tagName())
                if (this.layoutAttributeValue() === "") {
                    const elements = generateElements(this.tagName(), this.layoutAttributeValue(), {type:"None"})
                    this.addElements(elements)
                }

                // if we have a biggestBreakpoint, we need to generate elements
                // for the component when SuperiorTo, generate will ignore utilities in this case
                if (this.biggestBreakpoint) {
                    const mq: MediaQuery = {
                        type: "SuperiorTo",
                        size: this.biggestBreakpoint,
                        layoutAttributeValue: this.biggestBreakpointValue
                    };
                    const elements = generateElements(this.tagName(), this.layoutAttributeValue(), mq)
                    this.addElements(elements)
                }
                this.resetIndexes();
            }
            this.state = newState;
        }
    }
}



