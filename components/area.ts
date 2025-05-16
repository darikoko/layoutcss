import { getHarmonic } from "../harmonic";

export function areaCss(
    harmonicRatio: number,
    template: string="",
    rows: string[] = [],
    cols: string[] = [],
    gap: string="",
    gapX: string="",
    gapY: string="",
): string[] {
    const css: string[] = [];

    css.push(`
area-l{
  display: grid;
}
  `);

    if (template) {
        const templateAreas = getGridTemplateAreasValue(template);
        css.push(areaGridTemplateAreasStyle(template, templateAreas));

        for (const [index, letter] of uniqueLetters(template).entries()) {
            css.push(areaGridAreaUnitStyle(template, letter, index + 1));
        }

        const [rowsNb, colsNb] = countRowsAndCols(template);
        if (rows.length) {
            const selector = gridTemplateSelector(rows);
            const value = gridTemplateRule(rows, "row-", rowsNb);
            css.push(areaRowsStyle(selector, value, template));
        }

        if (cols.length) {
            const selector = gridTemplateSelector(cols);
            const value = gridTemplateRule(cols, "col-", colsNb);
            css.push(areaColsStyle(selector, value, template));
        }
    }

    if (gap) css.push(areaGapStyle(gap, getHarmonic(gap, harmonicRatio)));
    if (gapX) css.push(areaGapXStyle(gapX, getHarmonic(gapX, harmonicRatio)));
    if (gapY) css.push(areaGapYStyle(gapY, getHarmonic(gapY, harmonicRatio)));

    return css;
}

// Helpers
function areaGapStyle(value: string, harmonic: string): string {
    return `
area-l[layout~="gap:${value}"]{
  gap: ${harmonic};
}
  `;
}

function areaGapXStyle(value: string, harmonic: string): string {
    return `
area-l[layout~="gap-x:${value}"]{
  column-gap: ${harmonic};
}
  `;
}

function areaGapYStyle(value: string, harmonic: string): string {
    return `
area-l[layout~="gap-y:${value}"]{
  row-gap: ${harmonic};
}
  `;
}

function areaGridTemplateAreasStyle(value: string, template: string): string {
    return `
area-l[layout~="template:${value}"] {
  grid-template-areas: ${template};
}
  `;
}

function areaGridAreaUnitStyle(value: string, unit: string, index: number): string {
    return `
area-l[layout~="template:${value}"] > :nth-child(${index}) {
  grid-area: ${unit};
}
  `;
}

function areaRowsStyle(selector: string, value: string, templateSelector: string): string {
    return `
area-l[layout~="template:${templateSelector}"]${selector}{
  grid-template-rows: ${value};
}
  `;
}

function areaColsStyle(selector: string, value: string, templateSelector: string): string {
    return `
area-l[layout~="template:${templateSelector}"]${selector}{
  grid-template-columns: ${value};
}
  `;
}

function countRowsAndCols(text: string): [number, number] {
    const rows = (text.match(/\|/g) || []).length + 1;
    const firstRow = text.split("|")[0] || "";
    const cols = (firstRow.match(/-/g) || []).length + 1;
    return [rows, cols];
}

function getGridTemplateAreasValue(text: string): string {
    const noParens = text.replace(/[()]/g, "");
    return noParens
        .split("|")
        .map(part => `"${[...part].filter(c => c !== "-").join(" ")}"`)
        .join(" ");
}

function gridTemplateRule(items: string[], pattern: string, count: number): string {
    return Array.from({ length: count }, (_, i) => {
        const key = `${pattern}${i + 1}`;
        const item = items.find(it => it.startsWith(key));
        const value = item?.split(":")[1] ?? "1fr";
        return value;
    }).join(" ");
}

function gridTemplateSelector(items: string[]): string {
    return items.map(i => `[layout~="${i}"]`).join("");
}

function uniqueLetters(input: string): string[] {
    return [...new Set([...input].filter(c => /[a-z]/i.test(c)))].sort();
}
