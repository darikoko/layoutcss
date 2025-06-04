import { getHarmonic } from "../harmonic.js";

import { Component } from "./component.js";

export class Area extends Component {
    template: string = "";
    rows: string[] = [];
    cols: string[] = [];
    gap: string = "";
    gapX: string = "";
    gapY: string = "";

    constructor(layoutClasses: string[]) {
        super();
        this.setComponent(layoutClasses);
        this.rows = layoutClasses.filter((el)=> el.startsWith("row-"))
        this.cols = layoutClasses.filter((el)=> el.startsWith("col-"))
    }

    getCss(harmonicRatio: number): string[] {
        const css = [areaStyle];

        if (this.template) {
            const templateAreas = gridTemplateAreasValue(this.template);
            css.push(areaGridTemplateAreasStyle(this.template, templateAreas));

            const uniqueLetters = getUniqueLetters(this.template);
            uniqueLetters.forEach((letter, index) => {
                css.push(areaGridAreaUnitStyle(this.template, letter, index + 1));
            });

            const [rowsNb, colsNb] = countRowsAndCols(this.template);

            if (this.rows.length > 0) {
                const selector = gridTemplateRowsOrColsSelector(this.rows);
                const value = gridTemplateRowsOrColsRule(this.rows, "row-", rowsNb);
                css.push(areaRowsStyle(selector, value, this.template));
            }

            if (this.cols.length > 0) {
                const selector = gridTemplateRowsOrColsSelector(this.cols);
                const value = gridTemplateRowsOrColsRule(this.cols, "col-", colsNb);
                css.push(areaColsStyle(selector, value, this.template));
            }
        }

        if (this.gap) {
            const harmonicValue = getHarmonic(this.gap, harmonicRatio);
            css.push(areaGapStyle(this.gap, harmonicValue));
        }

        if (this.gapX) {
            const harmonicValue = getHarmonic(this.gapX, harmonicRatio);
            css.push(areaGapXStyle(this.gapX, harmonicValue));
        }

        if (this.gapY) {
            const harmonicValue = getHarmonic(this.gapY, harmonicRatio);
            css.push(areaGapYStyle(this.gapY, harmonicValue));
        }

        return css;
    }
}

const areaStyle = `
area-l {
    display: grid;
}
`;

const areaGapStyle = (value: string, harmonic: string) => `
area-l[layout~="gap:${value}"] {
    gap: ${harmonic};
}
`;

const areaGapXStyle = (value: string, harmonic: string) => `
area-l[layout~="gap-x:${value}"] {
    column-gap: ${harmonic};
}
`;

const areaGapYStyle = (value: string, harmonic: string) => `
area-l[layout~="gap-y:${value}"] {
    row-gap: ${harmonic};
}
`;

const areaGridTemplateAreasStyle = (value: string, template: string) => `
area-l[layout~="template:${value}"] {
    grid-template-areas: ${template};
}
`;

const areaGridAreaUnitStyle = (value: string, unit: string, index: number) => `
area-l[layout~="template:${value}"] > :nth-child(${index}) {
    grid-area: ${unit};
}
`;

const areaRowsStyle = (selector: string, value: string, templateSelector: string) => `
area-l[layout~="template:${templateSelector}"]${selector} {
    grid-template-rows: ${value};
}
`;

const areaColsStyle = (selector: string, value: string, templateSelector: string) => `
area-l[layout~="template:${templateSelector}"]${selector} {
    grid-template-columns: ${value};
}
`;

/**
 * Return the number of rows and cols from a template layout class in a tuple like this [rows, cols]
 * For example "(a-a-b|a-a-b)" will return [2, 3] because there are 2 rows and 3 columns
 */
const countRowsAndCols = (text: string): [number, number] => {
    const rows = (text.match(/\|/g) || []).length + 1;
    const cols = (text.split('|')[0].match(/-/g) || []).length + 1;
    return [rows, cols];
};

/**
 * Return the grid-template-areas value for a specific template value,
 * so "(a-a-b|a-a-b)" returns "\"a a b\" \"a a b\""
 */
const gridTemplateAreasValue = (text: string): string => {
    const areas: string[] = [];
    const textWithoutParentheses = text.replace(/[()]/g, "");

    for (const part of textWithoutParentheses.split('|')) {
        const area = part
            .split('')
            .filter(c => c !== '-')
            .join(' ');
        areas.push(`"${area}"`);
    }

    return areas.join(' ');
};

/**
 * Return the grid-template-columns value (if pattern is "col-") or grid-template-rows value (if pattern is "row-")
 * items is the list of col or row classes, pattern is "col-" or "row-" and number is the number of row or col.
 */
const gridTemplateRowsOrColsRule = (items: string[], pattern: string, number: number): string => {
    const rules: string[] = [];

    // We iterate from 1 to number and for each value
    // we will check if there is col-x:... or row-x:... associated
    // if it's the case it will take the value after the ':'
    // else it will use 1fr
    for (let i = 1; i <= number; i++) {
        const currentPattern = `${pattern}${i}`;
        const item = items.find(s => s.startsWith(currentPattern));

        if (item) {
            const parts = item.split(':');
            if (parts.length > 1) {
                rules.push(parts[1]);
            } else {
                rules.push("1fr");
            }
        } else {
            rules.push("1fr");
        }
    }

    return rules.join(' ');
};

const gridTemplateRowsOrColsSelector = (items: string[]): string => {
    const formattedItems = items.map(item => `[layout~="${item}"]`);
    return formattedItems.join('');
};

const getUniqueLetters = (input: string): string[] => {
    const uniqueChars: string[] = [];

    for (const c of input) {
        // Exclude '.' and check for uniqueness
        if (/[a-zA-Z]/.test(c) && !uniqueChars.includes(c)) {
            uniqueChars.push(c);
        }
    }

    return uniqueChars.sort();
};