import {getHarmonic} from "../harmonic";
import {Component} from "./component";

export class Slider extends Component{
    hideBar: boolean = false;
    itemWidth: string = "";
    height: string = "";
    gap: string = "";

    constructor(layoutClasses: string[]) {
        super()
        this.setComponent(layoutClasses)
    }

    getCss(harmonicRatio:number): string[] {
        const css = [sliderStyle];

        if (this.hideBar) {
            css.push(sliderHideBarStyle);
        }

        if (this.itemWidth) {
            css.push(sliderItemWidthStyle(this.itemWidth));
        }

        if (this.height) {
            css.push(sliderHeightStyle(this.height));
        }

        if (this.gap) {
            const h = getHarmonic(this.gap, harmonicRatio);
            css.push(sliderGapStyle(this.gap, h));
        }

        return css;
    }
}


const sliderStyle = `
  slider-l {
    display: flex;
    block-size: auto;
    overflow-x: auto;
    overflow-y: hidden;
  }

  slider-l > *:not(outsider-l[layout~="disinherit"]) {
    flex-shrink: 0;
    flex-grow: 0;
    height: auto;
    min-width: 0px;
  }

  slider-l > img {
    object-fit: cover;
  }
`;

const sliderHideBarStyle = `
  slider-l[layout~="hide-bar"] {
    overflow: hidden;
  }
`;

const sliderItemWidthStyle = (value: string) => `
  slider-l[layout~="item-width:${value}"] > *:not([layout~="disinherit"]) {
    flex-basis: ${value};
  }
`;

const sliderHeightStyle = (value: string) => `
  slider-l[layout~="height:${value}"] > *:not([layout~="disinherit"]) {
    block-size: ${value};
  }
`;

const sliderGapStyle = (value: string, harmonic: string) => `
  slider-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;
