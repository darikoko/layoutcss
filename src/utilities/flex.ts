import {Utility} from "./utility";

export class FlexBasis extends Utility {
    getCss(): string[] {
        let css = []
        css.push(flexBasisStyle(this.value));
        return css
    }
}

const flexBasisStyle = (value: string) => `
  [layout~="flex-basis:${value}"] {
    flex-basis: ${value};
  }
  `


export class FlexGrow extends Utility {
    getCss(): string[] {
        let css = []
        css.push(flexGrowStyle(this.value));
        return css
    }
}

const flexGrowStyle = (value: string) => `
  [layout~="flex-grow:${value}"] {
    flex-grow: ${value};
  }
  `

export class FlexShrink extends Utility {
    getCss(): string[] {
        let css = []
        css.push(flexShrinkStyle(this.value));
        return css
    }
}


const flexShrinkStyle = (value: string) => `
  [layout~="flex-shrink:${value}"] {
    flex-shrink: ${value};
  }
  `
