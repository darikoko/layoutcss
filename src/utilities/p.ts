import { getHarmonic } from "../harmonic";
import {Utility} from "./utility";


export class P extends Utility {
    getCss(harmonicRatio:number): string[] {
        let css = []
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        css.push(pStyle(this.value, harmonicValue));
        return css
    }
}

const pStyle = (value: string, harmonicValue:string) => `
  [layout~="p:${value}"] {
    padding: ${harmonicValue};
    --pl: ${harmonicValue};
    --pr: ${harmonicValue};
  }
  `


export class Pt extends Utility {
    getCss(harmonicRatio: number): string[] {
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        return [ptStyle(this.value, harmonicValue)];
    }
}

const ptStyle = (value: string, harmonicValue: string) => `
  [layout~="pt:${value}"] {
    padding-top: ${harmonicValue};
  }
`;


export class Pb extends Utility {
    getCss(harmonicRatio: number): string[] {
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        return [pbStyle(this.value, harmonicValue)];
    }
}

const pbStyle = (value: string, harmonicValue: string) => `
  [layout~="pb:${value}"] {
    padding-bottom: ${harmonicValue};
  }
`;


export class Pl extends Utility {
    getCss(harmonicRatio: number): string[] {
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        return [plStyle(this.value, harmonicValue)];
    }
}

const plStyle = (value: string, harmonicValue: string) => `
  [layout~="pl:${value}"] {
    padding-left: ${harmonicValue};
    --pl: ${harmonicValue};
  }
`;


export class Pr extends Utility {
    getCss(harmonicRatio: number): string[] {
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        return [prStyle(this.value, harmonicValue)];
    }
}

const prStyle = (value: string, harmonicValue: string) => `
  [layout~="pr:${value}"] {
    padding-right: ${harmonicValue};
    --pr: ${harmonicValue};
  }
`;


export class Px extends Utility {
    getCss(harmonicRatio: number): string[] {
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        return [pxStyle(this.value, harmonicValue)];
    }
}

const pxStyle = (value: string, harmonicValue: string) => `
  [layout~="px:${value}"] {
    padding-left: ${harmonicValue};
    padding-right: ${harmonicValue};
    --pl: ${harmonicValue};
    --pr: ${harmonicValue};
  }
`;


export class Py extends Utility {
    getCss(harmonicRatio: number): string[] {
        const harmonicValue = getHarmonic(this.value, harmonicRatio);
        return [pyStyle(this.value, harmonicValue)];
    }
}

const pyStyle = (value: string, harmonicValue: string) => `
  [layout~="py:${value}"] {
    padding-top: ${harmonicValue};
    padding-bottom: ${harmonicValue};
  }
`;

