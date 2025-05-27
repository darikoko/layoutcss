import {getHarmonic} from "../harmonic";
import {Component} from "./component";


export class Sidebar extends  Component{
    reverse: boolean = false;
    shrink: boolean = false;
    side: string = "";
    sideWidth: string = "";
    contentMin: string = "";
    gap: string = "";
    gapX: string = "";
    gapY: string = "";

    constructor(layoutClasses: string[]) {
        super()
        this.setComponent(layoutClasses)
    }

    getCss(harmonicRatio:number): string[] {
        const css = [sidebarStyle];

        if (this.reverse) {
            css.push(sidebarReverseStyle);
        }

        if (this.shrink) {
            css.push(sidebarShrinkStyle(this.reverse));
        }

        if (this.gap) {
            css.push(sidebarGapStyle(this.gap, getHarmonic(this.gap, harmonicRatio)));
        }

        if (this.gapX) {
            css.push(sidebarGapXStyle(this.gapX, getHarmonic(this.gapX, harmonicRatio)));
        }

        if (this.gapY) {
            css.push(sidebarGapYStyle(this.gapY, getHarmonic(this.gapY, harmonicRatio)));
        }

        if (this.side || this.sideWidth || this.contentMin) {
            const sideSelector = this.side ? `[layout*="side:${this.side}"]` : "";
            const sideWidthSelector = this.sideWidth ? `[layout*="side-width:${this.sideWidth}"]` : "";
            const contentMinSelector = this.contentMin ? `[layout*="content-min:${this.contentMin}"]` : "";

            const selectorOne =
                !this.side || this.side === "left" ? ":first-child" : ":last-child";
            const selectorTwo = selectorOne === ":first-child" ? ":last-child" : ":first-child";

            const finalContentMin = this.contentMin || "50%";
            const finalSideWidth = this.sideWidth || "auto";

            css.push(
                sidebarGroupStyle(
                    sideSelector,
                    sideWidthSelector,
                    contentMinSelector,
                    selectorOne,
                    selectorTwo,
                    finalSideWidth,
                    finalContentMin
                )
            );
        }

        return css;
    }
}


const sidebarStyle = `
  sidebar-l {
    display: flex;
    flex-wrap: wrap;
  }
`;

const sidebarReverseStyle = `
  sidebar-l[layout~=reverse] {
    flex-wrap: wrap-reverse;
  }
`;

const sidebarShrinkStyle = (reverse: boolean) => `
  sidebar-l[layout~=shrink] {
    align-items: flex-${reverse ? "end" : "start"};
  }
`;

const sidebarGapStyle = (value: string, harmonic: string) => `
  sidebar-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;

const sidebarGapXStyle = (value: string, harmonic: string) => `
  sidebar-l[layout~="gap-x:${value}"] {
    column-gap: ${harmonic};
  }
`;

const sidebarGapYStyle = (value: string, harmonic: string) => `
  sidebar-l[layout~="gap-y:${value}"] {
    row-gap: ${harmonic};
  }
`;

const sidebarGroupStyle = (
    sideSelector: string,
    sideWidthSelector: string,
    contentMinSelector: string,
    selectorOne: string,
    selectorTwo: string,
    sideWidth: string,
    contentMin: string
) => `
  sidebar-l${sideSelector}${sideWidthSelector}${contentMinSelector} > ${selectorOne}:not([layout~="disinherit"]) {
    flex-basis: ${sideWidth};
    flex-grow: 1;
    min-inline-size: initial;
    min-width: 0;
    min-height: 0;
  }

  sidebar-l${sideSelector}${sideWidthSelector}${contentMinSelector} > ${selectorTwo}:not([layout~="disinherit"]) {
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: ${contentMin};
  }
`;
