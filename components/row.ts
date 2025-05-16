// À adapter selon où est définie la fonction
import {getHarmonic} from "./harmonic";


export class Row {
    nowrap: boolean;
    twinWidth: boolean;
    direction: string;
    justify: string;
    align: string;
    gap: string;
    gapX: string;
    gapY: string;
    harmonicRatio: number;

    constructor(
        harmonicRatio: number,
        nowrap = false,
        twinWidth = false,
        direction = "",
        justify = "",
        align = "",
        gap = "",
        gapX = "",
        gapY = "",
    ) {
        this.harmonicRatio = harmonicRatio;
        this.nowrap = nowrap;
        this.twinWidth = twinWidth;
        this.direction = direction;
        this.justify = justify;
        this.align = align;
        this.gap = gap;
        this.gapX = gapX;
        this.gapY = gapY;
    }

    getCss(): string[] {
        const css = [rowStyle];

        if (this.nowrap) css.push(rowNoWrapStyle);
        if (this.twinWidth) css.push(rowTwinWidthStyle);
        if (this.direction) css.push(rowDirectionStyle(this.direction));
        if (this.justify) css.push(rowJustifyStyle(this.justify));
        if (this.align) css.push(rowAlignStyle(this.align));
        if (this.gap) {
            const harmonicValue = getHarmonic(this.gap, this.harmonicRatio);
            css.push(rowGapStyle(this.gap, harmonicValue));
        }
        if (this.gapX) {
            const harmonicValue = getHarmonic(this.gapX, this.harmonicRatio);
            css.push(rowGapXStyle(this.gapX, harmonicValue));
        }
        if (this.gapY) {
            const harmonicValue = getHarmonic(this.gapY, this.harmonicRatio);
            css.push(rowGapYStyle(this.gapY, harmonicValue));
        }

        return css;
    }
}

const rowStyle = `
  row-l {
    display: flex;
    flex-wrap: wrap;
  }

  row-l > * {
    min-width: 0;
  }
`;

const rowNoWrapStyle = `
  row-l[layout~="nowrap"] {
    flex-wrap: nowrap;
  }
`;

const rowTwinWidthStyle = `
  row-l[layout~="twin-width"] > * {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
  }
`;

const rowDirectionStyle = (value: string) => `
  row-l[layout~="direction:${value}"] {
    flex-direction: ${value};
  }
`;

const rowJustifyStyle = (value: string) => `
  row-l[layout~="justify:${value}"] {
    justify-content: ${value};
  }
`;

const rowAlignStyle = (value: string) => `
  row-l[layout~="align:${value}"] {
    align-items: ${value};
  }
`;

const rowGapStyle = (value: string, harmonic: string) => `
  row-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;

const rowGapXStyle = (value: string, harmonic: string) => `
  row-l[layout~="gap-x:${value}"] {
    column-gap: ${harmonic};
  }
`;

const rowGapYStyle = (value: string, harmonic: string) => `
  row-l[layout~="gap-y:${value}"] {
    row-gap: ${harmonic};
  }
`;
