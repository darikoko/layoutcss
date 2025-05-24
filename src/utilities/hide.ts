import {Utility} from "./utility";

export class HideOver extends Utility {
    getCss(): string[] {
        let css = []
        css.push(hideOverStyle(this.value));
        return css
    }
}

const hideOverStyle = (value: string ) => `
  @media screen and (min-width: ${value}) {
    [layout~="hide-over:${value}"] {
      display: none;
    }
  }
  `

export class HideUnder extends Utility {
    getCss(): string[] {
        let css = []
        css.push(hideUnderStyle(this.value));
        return css
    }
}

const hideUnderStyle = (value: string ) => `
  @media screen and (max-width: ${value}) {
    [layout~="hide-under:${value}"] {
      display: none;
    }
  }
  `
