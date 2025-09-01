import {getHarmonic} from "../harmonic.js";
import {Component} from "./component.js";

export class Rack extends Component{
    height: string="";
    minHeight: string="";
    maxHeight: string="";
    gap: string="";

    constructor(layoutClasses: string[]) {
        super()
        this.setComponent(layoutClasses)
    }

    getCss(harmonicRatio:number): string[] {
        const css = [rackStyle];

        if (this.height) {
            const harmonicValue = getHarmonic(this.height, harmonicRatio);
            css.push(rackHeightStyle(this.height, harmonicValue));
        }

        if (this.minHeight) {
            const harmonicValue = getHarmonic(this.minHeight, harmonicRatio);
            css.push(rackMinHeightStyle(this.minHeight, harmonicValue));
        }

        if (this.maxHeight) {
            const harmonicValue = getHarmonic(this.maxHeight, harmonicRatio);
            css.push(rackMaxHeightStyle(this.maxHeight, harmonicValue));
        }

        if (this.gap) {
            const harmonicValue = getHarmonic(this.gap, harmonicRatio);
            css.push(rackGapStyle(this.gap, harmonicValue));
        }

        return css;
    }
}

const rackStyle = `
  rack-l {
    display: flex;
    flex-direction: column;
  }

  rack-l > [layout~="centered"] {
    margin-block: auto;
  }

  rack-l > :first-child:not([layout~="centered"]):not([layout~="disinherit"]) {
    margin-block-start: 0;
  }

  rack-l > :last-child:not([layout~="centered"]):not([layout~="disinherit"]) {
    margin-block-end: 0;
  }
`;

const rackHeightStyle = (value: string, harmonic: string) => `
  rack-l[layout~="height:${value}"] {
    height: ${harmonic};
    overflow-y: auto;
  }
`;

const rackMinHeightStyle = (value: string, harmonic: string) => `
  rack-l[layout~="min-height:${value}"] {
    min-height: ${harmonic};
  }
`;

const rackMaxHeightStyle = (value: string, harmonic: string) => `
  rack-l[layout~="max-height:${value}"] {
    max-height: ${harmonic};
    overflow-y: auto;
  }
`;

const rackGapStyle = (value: string, harmonic: string) => `
  rack-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;
