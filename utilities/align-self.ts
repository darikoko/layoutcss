function alignSelfCss(value: string): string[] {
    return [`
  [layout~="align-self:${value}"] {
    align-self: ${value};
  }
  `];
}



