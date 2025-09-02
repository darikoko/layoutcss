import {Utility} from "./utility.js";

export class TextAlign extends Utility{
    getCss(): string[] {
        let css = []
        css.push(textAlignStyle(this.value))
        return css
    }
}

const textAlignStyle = (value: string) => `
  [layout~="text:${value}"] {
    text-align: ${value};
  }
`;


