import {getHarmonic} from "../harmonic.js";
import {Component} from "./component.js";


export class Col extends Component{
    nowrap: boolean = false;
    twinHeight: boolean = false;
    justify: string = "";
    align: string = "";
    gap: string = "";

    constructor(layoutClasses: string[]) {
        super()
        this.setComponent(layoutClasses)
    }

    getCss(harmonicRatio:number): string[] {
        const css = [colStyle];

        if (this.nowrap) css.push(colNoWrapStyle);
        if (this.twinHeight) css.push(colTwinHeightStyle);
        if (this.justify) css.push(colJustifyStyle(this.justify));
        if (this.align) css.push(colAlignStyle(this.align));
        if (this.gap) {
            const harmonicValue = getHarmonic(this.gap, harmonicRatio);
            css.push(colGapStyle(this.gap, harmonicValue));
        }
       

        return css;
    }
}

const colStyle = `
  col-l {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }

  col-l > * {
    min-width: 0;
  }
`;

const colNoWrapStyle = `
  col-l[layout~="nowrap"] {
    flex-wrap: nowrap;
  }
`;

const colTwinHeightStyle = `
  col-l[layout~="twin-height"] > * {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
  }
`;


const colJustifyStyle = (value: string) => `
  col-l[layout~="justify:${value}"] {
    justify-content: ${value};
  }
`;

const colAlignStyle = (value: string) => `
  col-l[layout~="align:${value}"] {
    align-items: ${value};
  }
`;

const colGapStyle = (value: string, harmonic: string) => `
  col-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;