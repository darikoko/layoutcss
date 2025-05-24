import { getHarmonic } from "../harmonic";
import {Utility} from "./utility";


export class Relative extends Utility {
    getCss(): string[] {
        let css = [relativeStyle]
        return css
    }
}

const relativeStyle = `
  [layout~="relative"] {
    position: relative;
  }
`;


export class Absolute extends Utility {
    getCss(): string[] {
        let css = [absoluteStyle]
        return css
    }
}
const absoluteStyle = `
  [layout~="absolute"] {
    position: absolute;
  }
`;

export class Sticky extends Utility {
    getCss(): string[] {
        let css = [stickyStyle]
        return css
    }
}

const stickyStyle = `
  [layout~="sticky"] {
    position: sticky;
  }
`;

export class Fixed extends Utility {
    getCss(): string[] {
        let css = [fixedStyle]
        return css
    }
}

const fixedStyle = `
  [layout~="fixed"] {
    position: fixed;
  }
`;

export class Static extends Utility {
    getCss(): string[] {
        let css = [staticStyle]
        return css
    }
}
const staticStyle = `
  [layout~="static"] {
    position: static;
  }
`;
