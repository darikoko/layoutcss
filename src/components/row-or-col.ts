import {getHarmonic} from "../harmonic.js";
import {Component} from "./component.js";


export class RowOrCol  extends Component{
    tagName: string;
    nowrap: boolean = false;
    twinWidth: boolean = false;
    direction: string = "";
    justify: string = "";
    align: string = "";
    gap: string = "";
    gapX: string = "";
    gapY: string = "";

    constructor(layoutClasses: string[], tagName:string) {
        super()
        this.tagName = tagName
        this.setComponent(layoutClasses)
    }

    getCss(harmonicRatio:number): string[] {
        const css = [rowOrColStyle(this.tagName)];

        if (this.nowrap) css.push(rowOrColNoWrapStyle(this.tagName));
        if (this.twinWidth) css.push(rowOrColTwinWidthStyle(this.tagName));
        if (this.direction) css.push(rowOrColDirectionStyle(this.tagName, this.direction));
        if (this.justify) css.push(rowOrColJustifyStyle(this.tagName, this.justify));
        if (this.align) css.push(rowOrColAlignStyle(this.tagName, this.align));
        if (this.gap) {
            const harmonicValue = getHarmonic(this.gap, harmonicRatio);
            css.push(rowOrColGapStyle(this.tagName, this.gap, harmonicValue));
        }
        if (this.gapX) {
            const harmonicValue = getHarmonic(this.gapX, harmonicRatio);
            css.push(rowOrColGapXStyle(this.tagName, this.gapX, harmonicValue));
        }
        if (this.gapY) {
            const harmonicValue = getHarmonic(this.gapY, harmonicRatio);
            css.push(rowOrColGapYStyle(this.tagName, this.gapY, harmonicValue));
        }

        console.log(css,"CSS ROWORCOL")
        return css;
    }
}

const rowOrColStyle = (tagName: string) =>`
  
  ${tagName} {
    display: flex;
    flex-wrap: wrap;
  }
  
  ${tagName} {
    flex-direction: ${tagName === 'row-col-l' ? 'row' : 'column'};
  }
  
  ${tagName} > * {
    min-width: 0;
  }
`;

const rowOrColNoWrapStyle = (tagName: string) =>`
  ${tagName}[layout~="nowrap"] {
    flex-wrap: nowrap;
  }
`;

const rowOrColTwinWidthStyle = (tagName: string) =>`
  ${tagName}[layout~="twin-width"] > * {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
  }
`;

const rowOrColDirectionStyle = (tagName:string, value: string) => `
  ${tagName}[layout~="direction:${value}"] {
    flex-direction: ${value};
  }
`;

const rowOrColJustifyStyle = (tagName:string, value: string) => `
  ${tagName}[layout~="justify:${value}"] {
    justify-content: ${value};
  }
`;

const rowOrColAlignStyle = (tagName:string, value: string) => `
  ${tagName}[layout~="align:${value}"] {
    align-items: ${value};
  }
`;

const rowOrColGapStyle = (tagName:string, value: string, harmonic: string) => `
  ${tagName}[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;

const rowOrColGapXStyle = (tagName:string, value: string, harmonic: string) => `
  ${tagName}[layout~="gap-x:${value}"] {
    column-gap: ${harmonic};
  }
`;

const rowOrColGapYStyle = (tagName:string, value: string, harmonic: string) => `
  ${tagName}[layout~="gap-y:${value}"] {
    row-gap: ${harmonic};
  }
`;
