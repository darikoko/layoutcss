function ratioCss(value: string): string[] {
    return [
        ratioStyle,
        `
  [layout~="ratio:${value}"] {
    aspect-ratio: ${value};
  }
  `
    ];
}

const ratioStyle = `
  img[layout~="ratio"],video[layout~="ratio"] {
    inline-size: 100%;
    object-fit: cover;
  }
`;
