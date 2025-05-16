import {getHarmonic} from "../harmonic";

function fontSizeCss(value: string, harmonicRatio: number): string[] {
    const harmonicValue = getHarmonic(value, harmonicRatio);
    return [
        `
  [layout~="font-size:${value}"] {
    font-size: ${harmonicValue};
  }
  `
    ];
}
