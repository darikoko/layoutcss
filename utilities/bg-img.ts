function bgImgCss(value: string): string[] {
    return [
        bgImgStyle,
        `
  [layout~="bg-img:${value}"] {
    background-image: url(${value});
  }
  `
    ];
}

const bgImgStyle = `
  [layout*="bg-img"] {
    background-origin: border-box;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
`;
