import {Utility} from "./utility.js";

export class AlignSelf extends Utility{
    getCss(): string[] {
        let css = []
        css.push(alignSelfStyle(this.value))
        return css
    }
}

const alignSelfStyle = (value: string) => `
  [layout~="align-self:${value}"] {
    align-self: ${value};
  }
`;


