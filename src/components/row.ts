import {getHarmonic} from "../harmonic.js";
import {Component} from "./component.js";


export class Row  extends Component{
    nowrap: boolean = false;
    twinWidth: boolean = false;
    justify: string = "";
    align: string = "";
    gap: string = "";

    constructor(layoutClasses: string[]) {
        super()
        this.setComponent(layoutClasses)
    }

    getCss(harmonicRatio:number): string[] {
        const css = [rowStyle];

        if (this.nowrap) css.push(rowNoWrapStyle);
        if (this.twinWidth) css.push(rowTwinWidthStyle);
        if (this.justify) css.push(rowJustifyStyle(this.justify));
        if (this.align) css.push(rowAlignStyle(this.align));
        if (this.gap) {
            const harmonicValue = getHarmonic(this.gap, harmonicRatio);
            css.push(rowGapStyle(this.gap, harmonicValue));
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
