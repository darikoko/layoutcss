import { getHarmonic } from "../harmonic.js";
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


export class Top extends Utility {
    getCss(harmonicRatio: number): string[] {
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        return [topStyle(this.value, harmonicValue)];
    }
}

const topStyle = (value: string, harmonicValue: string) => `
  [layout~="top:${value}"] {
    top: ${harmonicValue};
  }
`;

export class Bottom extends Utility {
    getCss(harmonicRatio: number): string[] {
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        return [bottomStyle(this.value, harmonicValue)];
    }
}

const bottomStyle = (value: string, harmonicValue: string) => `
  [layout~="bottom:${value}"] {
    bottom: ${harmonicValue};
  }
`;

export class Left extends Utility {
    getCss(harmonicRatio: number): string[] {
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        return [leftStyle(this.value, harmonicValue)];
    }
}

const leftStyle = (value: string, harmonicValue: string) => `
  [layout~="left:${value}"] {
    left: ${harmonicValue};
  }
`;


export class Right extends Utility {
    getCss(harmonicRatio: number): string[] {
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        return [rightStyle(this.value, harmonicValue)];
    }
}

const rightStyle = (value: string, harmonicValue: string) => `
  [layout~="right:${value}"] {
    right: ${harmonicValue};
  }
`;