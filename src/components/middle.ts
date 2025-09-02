import {Component} from "./component.js";

export class Middle extends  Component{

    constructor(layoutClasses: string[]) {
        super()
        this.setComponent(layoutClasses)
    }

    getCss(): string[] {
        let css = [middleStyle]
        return css
    }
}

const middleStyle = `
  middle-l {
    margin-block: auto;
  }
`;