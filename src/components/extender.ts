import {Component} from "./component";

export class Extender extends  Component{
    screen: boolean = false
    keepCenter: boolean = false
    keepP: boolean = false
    keepPl: boolean = false
    keepPr: boolean = false

    constructor(layoutClasses: string[]) {
        super()
        this.setComponent(layoutClasses)
    }

    getCss(): string[] {
        let css = [extenderStyle]
        if (this.screen) {
            css.push(extenderScreenStyle)
        }
        if (this.keepCenter) {
            css.push(extenderKeepCenterStyle)
        }
        if (this.keepP) {
            css.push(extenderKeepPStyle)
        }
        if (this.keepPl) {
            css.push(extenderKeepPlStyle)
        }
        if (this.keepPr) {
            css.push(extenderKeepPrStyle)
        }

        return css
    }
}

const extenderStyle = `
extender-l {
  display: block;
  width: calc(100% + var(--pr) + var(--pl));
  margin-inline-start: calc(0px - var(--pl));
  margin-inline-end: calc(0px - var(--pr));
}
`;

const extenderScreenStyle = `
extender-l[layout~=screen] {
  width: 100cqw;
  position: relative;
  margin-left: -50cqw;
  margin-right: -50cqw;
  left: 50%;
  right: 50%;
}
`;

const extenderKeepCenterStyle = `
extender-l[layout~="keep-center"] > * {
  box-sizing: content-box;
  max-inline-size: var(--center-max-width);
  margin-inline: auto;
}
`;

const extenderKeepPStyle = `
extender-l[layout~="keep-p"] {
  padding-right: var(--pr);
  padding-left: var(--pl);
}
`;

const extenderKeepPlStyle = `
extender-l[layout~="keep-pl"] {
  padding-left: var(--pl);
  padding-right: unset;
}
`;

const extenderKeepPrStyle = `
extender-l[layout~="keep-pr"] {
  padding-right: var(--pr);
  padding-left: unset;
}
`;
