import {Utility} from "./utility.js";

export class Z extends Utility {
    getCss(harmonicRatio:number): string[] {
        let css = []
        css.push(wStyle(this.value))
        return css
    }
}


const wStyle = (value: string ) => `
  [layout~="z:${value}"] {
    z-index: ${value};
  }
  `
