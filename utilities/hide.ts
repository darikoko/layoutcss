function hideOverCss(value: string): string[] {
    return [
        `
  @media screen and (min-width: ${value}) {
    [layout~="hide-over:${value}"] {
      display: none;
    }
  }
  `
    ];
}

function hideUnderCss(value: string): string[] {
    return [
        `
  @media screen and (max-width: ${value}) {
    [layout~="hide-under:${value}"] {
      display: none;
    }
  }
  `
    ];
}
