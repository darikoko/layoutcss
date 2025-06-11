import {Utility} from "./utility.js";

export class BgImg extends Utility{
    getCss(): string[] {
        let css = [bgImgBaseStyle]
        css.push(bgImgStyle(this.value));
        return css
    }
}

const bgImgStyle = (value: string) => `
  [layout~="bg-img:${value}"] {
    background-image: url(${value});
  }
  `

const bgImgBaseStyle = `
  [layout*="bg-img"] {
    background-origin: border-box;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
`;
