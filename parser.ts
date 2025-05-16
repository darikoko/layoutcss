
export enum State {
    Resting = "Resting",
    InsideTag = "InsideTag",
    ReadingTagName = "ReadingTagName",
    AfterTagName = "AfterTagName",
    ReadingAttributeName = "ReadingAttributeName",
    WaitingAttributeValue = "WaitingAttributeValue",
    ReadingAttributeValue = "ReadingAttributeValue"
}

export class Parser {
    state: State = State.Resting;
    text: string;

    tag_name_start: number | null = null;
    tag_name_end: number | null = null;
    attribute_name_start: number | null = null;
    attribute_name_end: number | null = null;
    layout_attribute_value_start: number | null = null;
    layout_attribute_value_end: number | null = null;
    layout_breakpoint_attribute_value_start: number | null = null;
    layout_breakpoint_attribute_value_end: number | null = null;
    biggest_breakpoint: number = 0;
    biggest_breakpoint_value: string = "";

    constructor(text: string) {
        this.text = text;
    }

    sliceText(start: number | null, end: number | null): string {
        if (start === null || end === null || start >= end) return "";
        return this.text.slice(start, end + 1);
    }

    tagName(): string {
        return this.sliceText(this.tag_name_start, this.tag_name_end);
    }

    attributeName(): string {
        return this.sliceText(this.attribute_name_start, this.attribute_name_end);
    }

    isLayoutAttribute(): boolean {
        return this.attributeName() === "layout";
    }

    isLayoutBreakpointAttribute(): boolean {
        return this.attributeName().startsWith("layout@");
    }

    layoutAttributeValue(): string {
        return this.sliceText(this.layout_attribute_value_start, this.layout_attribute_value_end);
    }

    layoutBreakpointAttributeValue(): string {
        return this.sliceText(this.layout_breakpoint_attribute_value_start, this.layout_breakpoint_attribute_value_end);
    }

    updateBiggestBreakpoint(new_breakpoint: number): void {
        if (new_breakpoint <= this.biggest_breakpoint) return;
        this.biggest_breakpoint = new_breakpoint;
        this.biggest_breakpoint_value = this.layoutBreakpointAttributeValue();
    }

    extractBreakpoint(): number {
        const attribute_name = this.attributeName();
        if (attribute_name.length < "layout@".length + 3) return 0;
        const slice = attribute_name.slice(7, attribute_name.length - 2);
        const parsed = parseInt(slice, 10);
        return isNaN(parsed) ? 0 : parsed;
    }

    parse(): void {
        for (let i = 0; i < this.text.length; i++) {
            const c = this.text[i];
            const new_state = transition(this.state, c);
            if (this.state === new_state) continue;

            if (new_state === State.ReadingTagName) {
                this.tag_name_start = i;
            } else if (this.state === State.ReadingTagName && new_state === State.AfterTagName) {
                this.tag_name_end = i - 1;
            } else if (new_state === State.ReadingAttributeName) {
                this.attribute_name_start = i;
            } else if (
                this.state === State.ReadingAttributeName &&
                ( new_state === State.WaitingAttributeValue)
            ) {
                this.attribute_name_end = i - 1;
            } else if (new_state === State.ReadingAttributeValue) {
                if (this.isLayoutAttribute()) {
                    this.layout_attribute_value_start = i + 1;
                } else if (this.isLayoutBreakpointAttribute()) {
                    this.layout_breakpoint_attribute_value_start = i + 1;
                }
            } else if (this.state === State.ReadingAttributeValue && new_state === State.AfterTagName) {
                if (this.isLayoutAttribute()) {
                    this.layout_attribute_value_end = i - 1;
                } else if (this.isLayoutBreakpointAttribute()) {
                    this.layout_breakpoint_attribute_value_end = i - 1;
                    const bp = this.extractBreakpoint();
                    this.updateBiggestBreakpoint(bp);
                    // TODO: Generate elements
                }
            } else if (new_state === State.Resting) {
                if (this.state === State.ReadingTagName) {
                    this.tag_name_end = i - 1;
                }
                // TODO: Generate elements if biggest_breakpoint exists
            }

            this.state = new_state;
        }
    }
}

export function transition(state: State, c: string): State {
    if (state === State.Resting && c === '<') return State.InsideTag;
    if (state === State.InsideTag && /[a-zA-Z]/.test(c)) return State.ReadingTagName;
    if ((state === State.ReadingTagName || state === State.ReadingAttributeName) && /\s/.test(c)) return State.AfterTagName;
    if (state === State.AfterTagName && /[a-zA-Z]/.test(c)) return State.ReadingAttributeName;
    if (state === State.ReadingAttributeName && c === '=') return State.WaitingAttributeValue;
    if (state === State.WaitingAttributeValue && c === '"') return State.ReadingAttributeValue;
    if (state === State.WaitingAttributeValue && c !== '"') return State.AfterTagName;
    if (state === State.ReadingAttributeValue && c === '"') return State.AfterTagName;
    if ((state === State.AfterTagName || state === State.ReadingTagName || state === State.ReadingAttributeName) && c === '>') {
        return State.Resting;
    }
    return state;
}

// Example usage:
const parser = new Parser('<box-l layout="row" layout@768="col">');
parser.parse();
console.log("Tag name:", parser.tagName()); // "box-l"
console.log("Biggest breakpoint:", parser.biggest_breakpoint); // 768
console.log("Breakpoint value:", parser.biggest_breakpoint_value); // "col"
