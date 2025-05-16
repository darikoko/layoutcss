function flexBasisCss(value: string): string[] {
    return [
        `
  [layout~="flex-basis:${value}"] {
    flex-basis: ${value};
  }
  `
    ];
}

function flexGrowCss(value: string): string[] {
    return [
        `
  [layout~="flex-grow:${value}"] {
    flex-grow: ${value};
  }
  `
    ];
}

function flexShrinkCss(value: string): string[] {
    return [
        `
  [layout~="flex-shrink:${value}"] {
    flex-shrink: ${value};
  }
  `
    ];
}
