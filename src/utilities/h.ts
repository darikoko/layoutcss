import { getHarmonic } from "../harmonic.js";
import { Utility } from "./utility.js";

export class H extends Utility {
  getCss(harmonicRatio: number): string[] {
    let css = []
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    css.push(hStyle(this.value, harmonicValue));
    return css
  }
}

const hStyle = (value: string, harmonicValue: string) => `
  [layout~="h:${value}"] {
    height: ${harmonicValue};
  }
  `
export class MinH extends Utility {
  getCss(harmonicRatio: number): string[] {
    let css = []
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    css.push(minHStyle(this.value, harmonicValue));
    return css
  }
}

const minHStyle = (value: string, harmonicValue: string) => `
  [layout~="min-h:${value}"] {
    min-height: ${harmonicValue};
  }
  `

export class MaxH extends Utility {
  getCss(harmonicRatio: number): string[] {
    let css = []
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    css.push(maxHStyle(this.value, harmonicValue));
    return css
  }
}

const maxHStyle = (value: string, harmonicValue: string) => `
  [layout~="max-h:${value}"] {
    max-height: ${harmonicValue};
  }
  `