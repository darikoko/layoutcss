import { getHarmonic } from "../harmonic.js";
import {Utility} from "./utility";

export class LineHeight extends Utility {
    getCss(): string[] {
        let css = []
        css.push(lineHeightStyle(this.value));
        return css
    }
}

const lineHeightStyle = (value: string) => `
  [layout~="line-height:${value}"] {
    line-height: ${value};
  }
  `
