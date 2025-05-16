import { getHarmonic } from "../harmonic";

function pCss(value: string, harmonicRatio: number): string[] {
    const harmonicValue = getHarmonic(value, harmonicRatio);
    return [
        `
  [layout~="p:${value}"] {
    padding: ${harmonicValue};
    --pl: ${harmonicValue};
    --pr: ${harmonicValue};
  }
  `
    ];
}

function ptCss(value: string, harmonicRatio: number): string[] {
    const harmonicValue = getHarmonic(value, harmonicRatio);
    return [
        `
  [layout~="pt:${value}"] {
    padding-top: ${harmonicValue};
  }
  `
    ];
}

function pbCss(value: string, harmonicRatio: number): string[] {
    const harmonicValue = getHarmonic(value, harmonicRatio);
    return [
        `
  [layout~="pb:${value}"] {
    padding-bottom: ${harmonicValue};
  }
  `
    ];
}

function plCss(value: string, harmonicRatio: number): string[] {
    const harmonicValue = getHarmonic(value, harmonicRatio);
    return [
        `
  [layout~="pl:${value}"] {
    padding-left: ${harmonicValue};
    --pl: ${harmonicValue};
  }
  `
    ];
}

function prCss(value: string, harmonicRatio: number): string[] {
    const harmonicValue = getHarmonic(value, harmonicRatio);
    return [
        `
  [layout~="pr:${value}"] {
    padding-right: ${harmonicValue};
    --pr: ${harmonicValue};
  }
  `
    ];
}

function pxCss(value: string, harmonicRatio: number): string[] {
    const harmonicValue = getHarmonic(value, harmonicRatio);
    return [
        `
  [layout~="px:${value}"] {
    padding-left: ${harmonicValue};
    padding-right: ${harmonicValue};
    --pl: ${harmonicValue};
    --pr: ${harmonicValue};
  }
  `
    ];
}

function pyCss(value: string, harmonicRatio: number): string[] {
    const harmonicValue = getHarmonic(value, harmonicRatio);
    return [
        `
  [layout~="py:${value}"] {
    padding-top: ${harmonicValue};
    padding-bottom: ${harmonicValue};
  }
  `
    ];
}
