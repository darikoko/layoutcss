import {getHarmonic} from "../harmonic";


export class Stack {
    gap: string;
    recursive: boolean;
    harmonicRatio: number;

    constructor(
        harmonicRatio: number,
        gap: string,
        recursive = false
    ) {
        this.gap = gap;
        this.recursive = recursive;
        this.harmonicRatio = harmonicRatio;
    }

    getCss(): string[] {
        const css = [stackStyle];

        if (this.gap) {
            const h = getHarmonic(this.gap, this.harmonicRatio);
            css.push(stackGapStyle(this.gap, h));
            if (this.recursive) {
                css.push(stackRecursiveStyle(h));
            }
        }

        return css;
    }
}

const stackStyle = `
  stack-l {
    display: block;
  }

  stack-l > * {
    margin-block: 0;
  }
`;

const stackGapStyle = (value: string, harmonic: string) => `
  stack-l[layout~="gap:${value}"] > * + *:not(outsider-l[layout~="disinherit"]) {
    margin-block-start: ${harmonic};
  }
`;

const stackRecursiveStyle = (harmonic: string) => `
  stack-l[layout~="recursive"] * + *:not(outsider-l[layout~="disinherit"]) {
    margin-block-start: ${harmonic};
  }
`;
