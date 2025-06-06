import {getHarmonic} from "../harmonic.js";
import {Utility} from "./utility";

export class FontSize extends Utility {
    getCss(harmonicRatio:number): string[] {
        let css = []
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        css.push(fontSizeStyle(this.value, harmonicValue));
        return css
    }
}

const fontSizeStyle = (value: string, harmonicValue:string) => `
  [layout~="fz:${value}"] {
    font-size: ${harmonicValue};
  }
  `
