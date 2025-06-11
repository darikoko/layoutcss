import {Utility} from "./utility.js";


export class Ratio extends Utility {
    getCss(): string[] {
        let css = [ratioBaseStyle]
        css.push(ratioStyle(this.value))
        return css
    }
}


const ratioStyle = (value: string) => `
  [layout~="ratio:${value}"] {
    aspect-ratio: ${value};
  }
  `

const ratioBaseStyle = `
  img[layout~="ratio"],video[layout~="ratio"] {
    inline-size: 100%;
    object-fit: cover;
  }
`;
