import {Utility} from "./utility.js";


export class Overflow extends Utility {
    getCss(): string[] {
        let css = []
        css.push(overflowStyle(this.value));
        return css
    }
}

const overflowStyle = (value: string) => `
  [layout~="overflow:${value}"],
  [layout~="of:${value}"]
  {
    overflow: ${value};
  }
  `

export class OverflowX extends Utility {
    getCss(): string[] {
        let css = []
        css.push(overflowXStyle(this.value));
        return css
    }
}

const overflowXStyle = (value: string) => `
  [layout~="overflow-x:${value}"],
  [layout~="ofx:${value}"]
  {
    overflow-x: ${value};
  }
  `

export class OverflowY extends Utility {
    getCss(): string[] {
        let css = []
        css.push(overflowYStyle(this.value));
        return css
    }
}

const overflowYStyle = (value: string) => `
  [layout~="overflow-y:${value}"],
  [layout~="ofy:${value}"]
  {
    overflow-y: ${value};
  }
  `