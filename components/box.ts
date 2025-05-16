class Box {
    maxWidth: string
    grow: boolean

    constructor(maxWidth: string, grow: boolean = false) {
        this.maxWidth = maxWidth;
        this.grow = grow;
    }

    getCss(): string[] {
        let css = [boxStyle]
        if (this.maxWidth) {
            css.push(boxMaxWidthStyle(this.maxWidth))
        }
        if (this.grow) {
            css.push(boxGrowStyle)
        }
        return css
    }
}

const boxStyle = `
  box-l {
    box-sizing: border-box;
    display: block;
    max-inline-size: fit-content;
  }
`;

const boxGrowStyle = `
  box-l[layout~="grow"] > * {
    width: 100%;
  }
`;

const boxMaxWidthStyle = (value: string) => `
  box-l[layout~="max-width:${value}"] {
    max-inline-size: ${value};
  }
`;

