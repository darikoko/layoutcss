import { getHarmonic } from "../harmonic";

function hCss(value: string, harmonicRatio: number): string[] {
    const harmonicValue = getHarmonic(value, harmonicRatio);
    return [
        `
  [layout~="h:${value}"] {
    height: ${harmonicValue};
  }
  `
    ];
}
