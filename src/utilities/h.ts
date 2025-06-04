import { getHarmonic } from "../harmonic.js";
import {Utility} from "./utility";

export class H extends Utility {
    getCss(harmonicRatio:number): string[] {
        let css = []
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        css.push(hStyle(this.value, harmonicValue));
        return css
    }
}

const hStyle = (value: string, harmonicValue:string) => `
  [layout~="h:${value}"] {
    height: ${harmonicValue};
  }
  `
