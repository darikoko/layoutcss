import {Utility} from "./utility.js";

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
