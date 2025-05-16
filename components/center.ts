class Center {
    maxWidth: string
    andText: boolean
    recursive: boolean

    constructor(maxWidth: string, andText: boolean = false, recursive: boolean = false) {
        this.maxWidth = maxWidth;
        this.andText = andText;
        this.recursive = recursive;
    }

    getCss(): string[] {
        let css = [centerStyle]
        if (this.maxWidth) {
            css.push(centerMaxWidthStyle(this.maxWidth))
        }
        if (this.andText) {
            css.push(centerAndTextStyle)
        }
        if (this.recursive) {
            css.push(centerRecursiveStyle)
        }
        return css
    }
}

const centerStyle = `
center-l {
  box-sizing: content-box;
  max-inline-size: fit-content;
  margin-inline: auto;
  display: block;
  text-align: initial;
}
`;

const centerAndTextStyle = `
center-l[layout~="and-text"] {
  text-align: center;
}
`;

const centerRecursiveStyle = `
center-l[layout~="recursive"] {
  display: flex;
  flex-direction: column;
  align-items: center;
}
`;

const centerMaxWidthStyle = (value: string): string => `
  center-l[layout~="max-width:${value}"] {
    max-inline-size: ${value};
    --center-max-width: ${value};
  }
`;

