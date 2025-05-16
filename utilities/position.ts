function relativeCss(): string[] {
    return [relativeStyle];
}
const relativeStyle = `
  [layout~="relative"] {
    position: relative;
  }
`;

function absoluteCss(): string[] {
    return [absoluteStyle];
}
const absoluteStyle = `
  [layout~="absolute"] {
    position: absolute;
  }
`;

function stickyCss(): string[] {
    return [stickyStyle];
}
const stickyStyle = `
  [layout~="sticky"] {
    position: sticky;
  }
`;

function fixedCss(): string[] {
    return [fixedStyle];
}
const fixedStyle = `
  [layout~="fixed"] {
    position: fixed;
  }
`;

function staticCss(): string[] {
    return [staticStyle];
}
const staticStyle = `
  [layout~="static"] {
    position: static;
  }
`;
