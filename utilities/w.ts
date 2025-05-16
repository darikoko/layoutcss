import { getHarmonic } from "../harmonic";

function wCss(value: string, harmonicRatio: number): string[] {
    const harmonicValue = getHarmonic(value, harmonicRatio);
    return [
        `
  [layout~="w:${value}"] {
    width: ${harmonicValue};
  }
  `
    ];
}
