import {Utility} from "./utility.js";

export class Z extends Utility {
    getCss(harmonicRatio:number): string[] {
        let css = []
        css.push(zStyle(this.value))
        return css
    }
}


const zStyle = (value: string ) => `
  [layout~="z:${value}"],
  [layout~="z-index:${value}"]
  {
    z-index: ${value};
  }
  `
