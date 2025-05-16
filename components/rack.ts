import {getHarmonic} from "../harmonic";

export class Rack {
    height: string;
    minHeight: string;
    maxHeight: string;
    gap: string;
    harmonicRatio: number;

    constructor(
        harmonicRatio: number,
        height: string = "",
        minHeight: string = "",
        maxHeight: string = "",
        gap: string = ""
    ) {
        this.harmonicRatio = harmonicRatio;
        this.height = height;
        this.minHeight = minHeight;
        this.maxHeight = maxHeight;
        this.gap = gap;
    }

    getCss(): string[] {
        const css = [rackStyle];

        if (this.height) {
            const harmonicValue = getHarmonic(this.height, this.harmonicRatio);
            css.push(rackHeightStyle(this.height, harmonicValue));
        }

        if (this.minHeight) {
            const harmonicValue = getHarmonic(this.minHeight, this.harmonicRatio);
            css.push(rackMinHeightStyle(this.minHeight, harmonicValue));
        }

        if (this.maxHeight) {
            const harmonicValue = getHarmonic(this.maxHeight, this.harmonicRatio);
            css.push(rackMaxHeightStyle(this.maxHeight, harmonicValue));
        }

        if (this.gap) {
            const harmonicValue = getHarmonic(this.gap, this.harmonicRatio);
            css.push(rackGapStyle(this.gap, harmonicValue));
        }

        return css;
    }
}

const rackStyle = `
  rack-l {
    display: flex;
    flex-direction: column;
  }

  rack-l > [layout~="centered"] {
    margin-block: auto;
  }

  rack-l > :first-child:not([layout~="centered"]):not(outsider-l[layout~="disinherit"]) {
    margin-block-start: 0;
  }

  rack-l > :last-child:not([layout~="centered"]):not(outsider-l[layout~="disinherit"]) {
    margin-block-end: 0;
  }
`;

const rackHeightStyle = (value: string, harmonic: string) => `
  rack-l[layout~="height:${value}"] {
    height: ${harmonic};
    overflow-y: auto;
  }
`;

const rackMinHeightStyle = (value: string, harmonic: string) => `
  rack-l[layout~="min-height:${value}"] {
    min-height: ${harmonic};
  }
`;

const rackMaxHeightStyle = (value: string, harmonic: string) => `
  rack-l[layout~="max-height:${value}"] {
    max-height: ${harmonic};
  }
`;

const rackGapStyle = (value: string, harmonic: string) => `
  rack-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;
