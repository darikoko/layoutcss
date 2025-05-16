import {getHarmonic} from "../harmonic";


export class Switcher {
    threshold: string;
    limit: string;
    reverse: boolean;
    gap: string;
    gapX: string;
    gapY: string;
    harmonicRatio: number;

    constructor(
        harmonicRatio: number,
        threshold = "",
        limit = "",
        reverse = false,
        gap = "",
        gapX = "",
        gapY = ""
    ) {
        this.threshold = threshold;
        this.limit = limit;
        this.reverse = reverse;
        this.gap = gap;
        this.gapX = gapX;
        this.gapY = gapY;
        this.harmonicRatio = harmonicRatio;
    }

    getCss(): string[] {
        const css = [switcherStyle];

        if (this.threshold) {
            css.push(switcherThresholdStyle(this.threshold));
        }

        if (this.limit) {
            css.push(switcherLimitStyle(this.limit));
        }

        if (this.reverse) {
            css.push(switcherReverseStyle);
        }

        if (this.gap) {
            const h = getHarmonic(this.gap, this.harmonicRatio);
            css.push(switcherGapStyle(this.gap, h));
        }

        if (this.gapX) {
            const h = getHarmonic(this.gapX, this.harmonicRatio);
            css.push(switcherGapXStyle(this.gapX, h));
        }

        if (this.gapY) {
            const h = getHarmonic(this.gapY, this.harmonicRatio);
            css.push(switcherGapYStyle(this.gapY, h));
        }

        return css;
    }
}

const switcherStyle = `
  switcher-l {
    display: flex;
    flex-wrap: wrap;
  }

  switcher-l > *:not(outsider-l[layout~="disinherit"]) {
    flex-grow: 1;
  }
`;

const switcherReverseStyle = `
  switcher-l[layout~="reverse"] {
    flex-wrap: wrap-reverse;
  }
`;

const switcherThresholdStyle = (value: string) => `
  switcher-l[layout~="threshold:${value}"] > *:not(outsider-l[layout~="disinherit"]) {
    flex-basis: calc((${value} - 100%) * 999);
  }
`;

const switcherLimitStyle = (value: string) => `
  switcher-l[layout~="limit:${value}"] > :nth-last-child(n+${value}):not(outsider-l[layout~="disinherit"]),
  switcher-l[layout~="limit:${value}"] > :nth-last-child(n+${value}) ~ *:not(outsider-l[layout~="disinherit"]) {
    flex-basis: 100%;
  }
`;

const switcherGapStyle = (value: string, harmonic: string) => `
  switcher-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;

const switcherGapXStyle = (value: string, harmonic: string) => `
  switcher-l[layout~="gap-x:${value}"] {
    column-gap: ${harmonic};
  }
`;

const switcherGapYStyle = (value: string, harmonic: string) => `
  switcher-l[layout~="gap-y:${value}"] {
    row-gap: ${harmonic};
  }
`;
