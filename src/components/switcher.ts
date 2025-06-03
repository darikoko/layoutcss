import {getHarmonic} from "../harmonic";
import {Component} from "./component";


export class Switcher extends Component{
    threshold: string = "";
    limit: string = "";
    reverse: boolean = false;
    gap: string = "";
    gapX: string = "";
    gapY: string = "";

    constructor(layoutClasses: string[]) {
        super()
        this.setComponent(layoutClasses)
    }

    getCss(harmonicRatio:number): string[] {
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
            const h = getHarmonic(this.gap, harmonicRatio);
            css.push(switcherGapStyle(this.gap, h));
        }

        if (this.gapX) {
            const h = getHarmonic(this.gapX, harmonicRatio);
            css.push(switcherGapXStyle(this.gapX, h));
        }

        if (this.gapY) {
            const h = getHarmonic(this.gapY, harmonicRatio);
            css.push(switcherGapYStyle(this.gapY, h));
        }

        return css;
    }
}

// flex-basis:0 on child allows images to no resize the flexbox but
// behave like a div which takes the full width
const switcherStyle = `
  switcher-l {
    display: flex;
    flex-wrap: wrap;
  }

  switcher-l > *:not([layout~="disinherit"]) {
    flex-grow: 1;
    flex-basis:0;
  }
`;

const switcherReverseStyle = `
  switcher-l[layout~="reverse"] {
    flex-wrap: wrap-reverse;
  }
`;

const switcherThresholdStyle = (value: string) => `
  switcher-l[layout~="threshold:${value}"] > *:not([layout~="disinherit"]) {
    flex-basis: calc((${value} - 100%) * 999);
  }
`;

const switcherLimitStyle = (value: string) => `
  switcher-l[layout~="limit:${value}"] > :nth-last-child(n+${value}):not([layout~="disinherit"]),
  switcher-l[layout~="limit:${value}"] > :nth-last-child(n+${value}) ~ *:not([layout~="disinherit"]) {
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
