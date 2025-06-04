import { getHarmonic } from "../harmonic.js";
import {Utility} from "./utility";

export class W extends Utility {
    getCss(harmonicRatio:number): string[] {
        let css = []
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        css.push(wStyle(this.value, harmonicValue))
        return css
    }
}


const wStyle = (value: string, harmonicValue:string) => `
  [layout~="w:${value}"] {
    width: ${harmonicValue};
  }
  `