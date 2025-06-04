import {getHarmonic} from "../harmonic.js";
import {Component} from "./component.js";


export class Stack extends Component{
    gap: string = "";
    recursive: boolean = false;

    constructor(layoutClasses: string[]) {
        super()
        this.setComponent(layoutClasses)
    }

    getCss(harmonicRatio:number): string[] {
        const css = [stackStyle];

        if (this.gap) {
            const h = getHarmonic(this.gap, harmonicRatio);
            css.push(stackGapStyle(this.gap, h));
            if (this.recursive) {
                css.push(stackRecursiveStyle(h));
            }
        }

        return css;
    }
}

const stackStyle = `
  stack-l {
    display: block;
  }

  stack-l > * {
    margin-block: 0;
  }
`;

const stackGapStyle = (value: string, harmonic: string) => `
  stack-l[layout~="gap:${value}"] > * + *:not([layout~="disinherit"]) {
    margin-block-start: ${harmonic};
  }
`;

const stackRecursiveStyle = (harmonic: string) => `
  stack-l[layout~="recursive"] * + *:not([layout~="disinherit"]) {
    margin-block-start: ${harmonic};
  }
`;
