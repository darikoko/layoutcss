// src/harmonic.ts
function isStrictNumber(value) {
  const n = parseFloat(value);
  return !isNaN(n) && n.toString() === value;
}
function getHarmonic(value, harmonic) {
  if (value.startsWith("--")) {
    return `var(${value})`;
  }
  if (value === "none") {
    return "0px";
  }
  if (isStrictNumber(value)) {
    const computed = Math.pow(harmonic, parseFloat(value));
    return `${computed.toFixed(5)}rem`;
  }
  return value;
}

// src/components/component.ts
var Component = class {
  setComponent(layoutClasses) {
    for (const [key, value] of Object.entries(this)) {
      const formatedKey = this.camelToKebab(key);
      if (value === "") {
        this[key] = this.getValue(layoutClasses, formatedKey);
      } else if (value === false) {
        this[key] = layoutClasses.includes(formatedKey);
      }
    }
  }
  camelToKebab(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }
  getValue(list, className) {
    for (const item of list) {
      if (item.startsWith(className + ":")) {
        return item.split(":")[1].trim();
      }
    }
    return "";
  }
};

// src/components/grid.ts
var Grid = class extends Component {
  minCellWidth = "";
  minCols = "";
  maxCols = "";
  gap = "";
  gapX = "";
  gapY = "";
  constructor(layoutClasses) {
    super();
    this.setComponent(layoutClasses);
  }
  getCss(harmonicRatio) {
    let css = [gridStyle];
    if (this.gap) {
      const harmonicValue = getHarmonic(this.gap, harmonicRatio);
      css.push(gridGapStyle(this.gap, harmonicValue));
    }
    if (this.gapX) {
      const harmonicValue = getHarmonic(this.gapX, harmonicRatio);
      css.push(gridGapXStyle(this.gapX, harmonicValue));
    }
    if (this.gapY) {
      const harmonicValue = getHarmonic(this.gapY, harmonicRatio);
      css.push(gridGapYStyle(this.gapY, harmonicValue));
    }
    if (this.minCellWidth) {
      const minCols = this.minCols || null;
      const maxCols = this.maxCols || null;
      if (minCols && maxCols) {
        const gapDeltaMin = gapDelta(minCols, this.gap, harmonicRatio);
        const gapDeltaMax = gapDelta(maxCols, this.gap, harmonicRatio);
        const fr = 1 / (parseFloat(minCols) || 1);
        css.push(
          gridGroupMinColsMaxCols(
            this.minCellWidth,
            minCols,
            maxCols,
            gapDeltaMin,
            gapDeltaMax,
            fr
          )
        );
      } else if (minCols && !maxCols) {
        const gapDeltaMin = gapDelta(minCols, this.gap, harmonicRatio);
        css.push(gridGroupMinCols(this.minCellWidth, minCols, gapDeltaMin));
      } else if (!minCols && maxCols) {
        const gapDeltaMax = gapDelta(maxCols, this.gap, harmonicRatio);
        css.push(gridGroupMaxCols(this.minCellWidth, maxCols, gapDeltaMax));
      } else {
        css.push(gridGroupEmpty(this.minCellWidth));
      }
    }
    return css;
  }
};
var gridStyle = `
  grid-l {
    display: grid;
  }
`;
var gridGapStyle = (value, harmonic) => `
  grid-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;
var gridGapXStyle = (value, harmonic) => `
  grid-l[layout~="gap-x:${value}"] {
    column-gap: ${harmonic};
  }
`;
var gridGapYStyle = (value, harmonic) => `
  grid-l[layout~="gap-y:${value}"] {
    row-gap: ${harmonic};
  }
`;
var gridGroupEmpty = (minCellWidth) => `
  grid-l[layout*="min-cell-width:${minCellWidth}"] {
    grid-template-columns: repeat(auto-fit, minmax(min(${minCellWidth}, 100%), 1fr));
  }
`;
var gridGroupMaxCols = (minCellWidth, maxCols, gapDeltaMax) => `
  grid-l[layout*="min-cell-width:${minCellWidth}"][layout*="max-cols:${maxCols}"] {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, max(${minCellWidth}, (100% / ${maxCols} - ${gapDeltaMax}))), 1fr));
  }
`;
var gridGroupMinCols = (minCellWidth, minCols, gapDeltaMin) => `
  grid-l[layout*="min-cell-width:${minCellWidth}"][layout*="min-cols:${minCols}"]:has(:nth-child(${minCols})) {
    grid-template-columns: repeat(auto-fit, minmax(min((100% / ${minCols} - ${gapDeltaMin}), ${minCellWidth}), 1fr));
  }
  grid-l[layout*="min-cell-width:${minCellWidth}"][layout*="min-cols:${minCols}"] {
    grid-template-columns: repeat(${minCols}, 1fr);
  }
`;
var gridGroupMinColsMaxCols = (minCellWidth, minCols, maxCols, gapDeltaMin, gapDeltaMax, fr) => `
  grid-l[layout*="min-cell-width:${minCellWidth}"][layout*="min-cols:${minCols}"][layout*="max-cols:${maxCols}"]:has(:nth-child(${minCols})) {
    grid-template-columns:
      repeat(auto-fit,
        minmax(
          min(
            (100% / ${minCols} - ${gapDeltaMin}),
            max(${minCellWidth}, (100% / ${maxCols} - ${gapDeltaMax}))
          ),
          ${fr}fr
        )
      );
  }
  grid-l[layout*="min-cell-width:${minCellWidth}"][layout*="min-cols:${minCols}"][layout*="max-cols:${maxCols}"] {
    grid-template-columns: repeat(${minCols}, 1fr);
  }
`;
var gapDelta = (cols, gap, harmonicRatio) => {
  if (gap) {
    const colsNumber = parseFloat(cols);
    if (!isNaN(colsNumber)) {
      const hr = getHarmonic(gap, harmonicRatio);
      return `${hr} * (${colsNumber} - 0.98) / ${colsNumber}`;
    }
  }
  return "0px";
};

// src/components/extender.ts
var Extender = class extends Component {
  screen = false;
  keepCenter = false;
  keepP = false;
  keepPl = false;
  keepPr = false;
  constructor(layoutClasses) {
    super();
    this.setComponent(layoutClasses);
  }
  getCss() {
    let css = [extenderStyle];
    if (this.screen) {
      css.push(extenderScreenStyle);
    }
    if (this.keepCenter) {
      css.push(extenderKeepCenterStyle);
    }
    if (this.keepP) {
      css.push(extenderKeepPStyle);
    }
    if (this.keepPl) {
      css.push(extenderKeepPlStyle);
    }
    if (this.keepPr) {
      css.push(extenderKeepPrStyle);
    }
    return css;
  }
};
var extenderStyle = `
extender-l {
  display: block;
  width: calc(100% + var(--pr) + var(--pl));
  margin-inline-start: calc(0px - var(--pl));
  margin-inline-end: calc(0px - var(--pr));
}
`;
var extenderScreenStyle = `
extender-l[layout~=screen] {
  width: 100cqw;
  position: relative;
  margin-left: -50cqw;
  margin-right: -50cqw;
  left: 50%;
  right: 50%;
}
`;
var extenderKeepCenterStyle = `
extender-l[layout~="keep-center"] > * {
  box-sizing: content-box;
  max-inline-size: var(--center-max-width);
  margin-inline: auto;
}
`;
var extenderKeepPStyle = `
extender-l[layout~="keep-p"] {
  padding-right: var(--pr);
  padding-left: var(--pl);
}
`;
var extenderKeepPlStyle = `
extender-l[layout~="keep-pl"] {
  padding-left: var(--pl);
  padding-right: unset;
}
`;
var extenderKeepPrStyle = `
extender-l[layout~="keep-pr"] {
  padding-right: var(--pr);
  padding-left: unset;
}
`;

// src/components/rack.ts
var Rack = class extends Component {
  height = "";
  minHeight = "";
  maxHeight = "";
  gap = "";
  constructor(layoutClasses) {
    super();
    this.setComponent(layoutClasses);
  }
  getCss(harmonicRatio) {
    const css = [rackStyle];
    if (this.height) {
      const harmonicValue = getHarmonic(this.height, harmonicRatio);
      css.push(rackHeightStyle(this.height, harmonicValue));
    }
    if (this.minHeight) {
      const harmonicValue = getHarmonic(this.minHeight, harmonicRatio);
      css.push(rackMinHeightStyle(this.minHeight, harmonicValue));
    }
    if (this.maxHeight) {
      const harmonicValue = getHarmonic(this.maxHeight, harmonicRatio);
      css.push(rackMaxHeightStyle(this.maxHeight, harmonicValue));
    }
    if (this.gap) {
      const harmonicValue = getHarmonic(this.gap, harmonicRatio);
      css.push(rackGapStyle(this.gap, harmonicValue));
    }
    return css;
  }
};
var rackStyle = `
  rack-l {
    display: flex;
    flex-direction: column;
  }

  rack-l > [layout~="centered"] {
    margin-block: auto;
  }

  rack-l > :first-child:not([layout~="centered"]):not([layout~="disinherit"]) {
    margin-block-start: 0;
  }

  rack-l > :last-child:not([layout~="centered"]):not([layout~="disinherit"]) {
    margin-block-end: 0;
  }
`;
var rackHeightStyle = (value, harmonic) => `
  rack-l[layout~="height:${value}"] {
    height: ${harmonic};
    overflow-y: auto;
  }
`;
var rackMinHeightStyle = (value, harmonic) => `
  rack-l[layout~="min-height:${value}"] {
    min-height: ${harmonic};
  }
`;
var rackMaxHeightStyle = (value, harmonic) => `
  rack-l[layout~="max-height:${value}"] {
    max-height: ${harmonic};
  }
`;
var rackGapStyle = (value, harmonic) => `
  rack-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;

// src/components/row.ts
var Row = class extends Component {
  nowrap = false;
  twinWidth = false;
  direction = "";
  justify = "";
  align = "";
  gap = "";
  gapX = "";
  gapY = "";
  constructor(layoutClasses) {
    super();
    this.setComponent(layoutClasses);
  }
  getCss(harmonicRatio) {
    const css = [rowStyle];
    if (this.nowrap) css.push(rowNoWrapStyle);
    if (this.twinWidth) css.push(rowTwinWidthStyle);
    if (this.direction) css.push(rowDirectionStyle(this.direction));
    if (this.justify) css.push(rowJustifyStyle(this.justify));
    if (this.align) css.push(rowAlignStyle(this.align));
    if (this.gap) {
      const harmonicValue = getHarmonic(this.gap, harmonicRatio);
      css.push(rowGapStyle(this.gap, harmonicValue));
    }
    if (this.gapX) {
      const harmonicValue = getHarmonic(this.gapX, harmonicRatio);
      css.push(rowGapXStyle(this.gapX, harmonicValue));
    }
    if (this.gapY) {
      const harmonicValue = getHarmonic(this.gapY, harmonicRatio);
      css.push(rowGapYStyle(this.gapY, harmonicValue));
    }
    return css;
  }
};
var rowStyle = `
  row-l {
    display: flex;
    flex-wrap: wrap;
  }

  row-l > * {
    min-width: 0;
  }
`;
var rowNoWrapStyle = `
  row-l[layout~="nowrap"] {
    flex-wrap: nowrap;
  }
`;
var rowTwinWidthStyle = `
  row-l[layout~="twin-width"] > * {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
  }
`;
var rowDirectionStyle = (value) => `
  row-l[layout~="direction:${value}"] {
    flex-direction: ${value};
  }
`;
var rowJustifyStyle = (value) => `
  row-l[layout~="justify:${value}"] {
    justify-content: ${value};
  }
`;
var rowAlignStyle = (value) => `
  row-l[layout~="align:${value}"] {
    align-items: ${value};
  }
`;
var rowGapStyle = (value, harmonic) => `
  row-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;
var rowGapXStyle = (value, harmonic) => `
  row-l[layout~="gap-x:${value}"] {
    column-gap: ${harmonic};
  }
`;
var rowGapYStyle = (value, harmonic) => `
  row-l[layout~="gap-y:${value}"] {
    row-gap: ${harmonic};
  }
`;

// src/components/sidebar.ts
var Sidebar = class extends Component {
  reverse = false;
  shrink = false;
  side = "";
  sideWidth = "";
  contentMin = "";
  gap = "";
  gapX = "";
  gapY = "";
  constructor(layoutClasses) {
    super();
    this.setComponent(layoutClasses);
  }
  getCss(harmonicRatio) {
    const css = [sidebarStyle];
    if (this.reverse) {
      css.push(sidebarReverseStyle);
    }
    if (this.shrink) {
      css.push(sidebarShrinkStyle(this.reverse));
    }
    if (this.gap) {
      css.push(sidebarGapStyle(this.gap, getHarmonic(this.gap, harmonicRatio)));
    }
    if (this.gapX) {
      css.push(sidebarGapXStyle(this.gapX, getHarmonic(this.gapX, harmonicRatio)));
    }
    if (this.gapY) {
      css.push(sidebarGapYStyle(this.gapY, getHarmonic(this.gapY, harmonicRatio)));
    }
    if (this.side || this.sideWidth || this.contentMin) {
      const sideSelector = this.side ? `[layout*="side:${this.side}"]` : "";
      const sideWidthSelector = this.sideWidth ? `[layout*="side-width:${this.sideWidth}"]` : "";
      const contentMinSelector = this.contentMin ? `[layout*="content-min:${this.contentMin}"]` : "";
      const selectorOne = !this.side || this.side === "left" ? ":nth-child(1)" : ":nth-child(2)";
      const selectorTwo = selectorOne === ":nth-child(1)" ? ":nth-child(2)" : ":nth-child(1)";
      const finalContentMin = this.contentMin || "50%";
      const finalSideWidth = this.sideWidth || "auto";
      css.push(
        sidebarGroupStyle(
          sideSelector,
          sideWidthSelector,
          contentMinSelector,
          selectorOne,
          selectorTwo,
          finalSideWidth,
          finalContentMin
        )
      );
    }
    return css;
  }
};
var sidebarStyle = `
  sidebar-l {
    display: flex;
    flex-wrap: wrap;
  }
`;
var sidebarReverseStyle = `
  sidebar-l[layout~=reverse] {
    flex-wrap: wrap-reverse;
  }
`;
var sidebarShrinkStyle = (reverse) => `
  sidebar-l[layout~=shrink] {
    align-items: flex-${reverse ? "end" : "start"};
  }
`;
var sidebarGapStyle = (value, harmonic) => `
  sidebar-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;
var sidebarGapXStyle = (value, harmonic) => `
  sidebar-l[layout~="gap-x:${value}"] {
    column-gap: ${harmonic};
  }
`;
var sidebarGapYStyle = (value, harmonic) => `
  sidebar-l[layout~="gap-y:${value}"] {
    row-gap: ${harmonic};
  }
`;
var sidebarGroupStyle = (sideSelector, sideWidthSelector, contentMinSelector, selectorOne, selectorTwo, sideWidth, contentMin) => `
  sidebar-l${sideSelector}${sideWidthSelector}${contentMinSelector} > ${selectorOne}:not([layout~="disinherit"]) {
    flex-basis: ${sideWidth};
    flex-grow: 1;
    min-inline-size: initial;
    min-width: 0;
    min-height: 0;
  }

  sidebar-l${sideSelector}${sideWidthSelector}${contentMinSelector} > ${selectorTwo}:not([layout~="disinherit"]) {
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: ${contentMin};
  }
`;

// src/components/center.ts
var Center = class extends Component {
  maxWidth = "";
  andText = false;
  recursive = false;
  constructor(layoutClasses) {
    super();
    this.setComponent(layoutClasses);
  }
  getCss() {
    let css = [centerStyle];
    if (this.maxWidth) {
      css.push(centerMaxWidthStyle(this.maxWidth));
    }
    if (this.andText) {
      css.push(centerAndTextStyle);
    }
    if (this.recursive) {
      css.push(centerRecursiveStyle);
    }
    return css;
  }
};
var centerStyle = `
center-l {
  box-sizing: content-box;
  max-inline-size: fit-content;
  margin-inline: auto;
  display: block;
  text-align: initial;
}
`;
var centerAndTextStyle = `
center-l[layout~="and-text"] {
  text-align: center;
}
`;
var centerRecursiveStyle = `
center-l[layout~="recursive"] {
  display: flex;
  flex-direction: column;
  align-items: center;
}
`;
var centerMaxWidthStyle = (value) => `
  center-l[layout~="max-width:${value}"] {
    max-inline-size: ${value};
    --center-max-width: ${value};
  }
`;

// src/components/box.ts
var Box = class extends Component {
  maxWidth = "";
  grow = false;
  constructor(layoutClasses) {
    super();
    this.setComponent(layoutClasses);
  }
  getCss() {
    let css = [boxStyle];
    if (this.maxWidth) {
      css.push(boxMaxWidthStyle(this.maxWidth));
    }
    if (this.grow) {
      css.push(boxGrowStyle);
    }
    return css;
  }
};
var boxStyle = `
  box-l {
    box-sizing: border-box;
    display: block;
    max-inline-size: fit-content;
  }
`;
var boxGrowStyle = `
  box-l[layout~="grow"] > * {
    width: 100%;
  }
`;
var boxMaxWidthStyle = (value) => `
  box-l[layout~="max-width:${value}"] {
    max-inline-size: ${value};
  }
`;

// src/components/slider.ts
var Slider = class extends Component {
  hideBar = false;
  itemWidth = "";
  height = "";
  gap = "";
  constructor(layoutClasses) {
    super();
    this.setComponent(layoutClasses);
  }
  getCss(harmonicRatio) {
    let css = [sliderStyle];
    if (this.hideBar) {
      css.push(sliderHideBarStyle);
    }
    if (this.itemWidth) {
      css.push(sliderItemWidthStyle(this.itemWidth));
    }
    if (this.height) {
      css.push(sliderHeightStyle(this.height));
    }
    if (this.gap) {
      const h = getHarmonic(this.gap, harmonicRatio);
      css.push(sliderGapStyle(this.gap, h));
    }
    return css;
  }
};
var sliderStyle = `
  slider-l {
    display: flex;
    block-size: auto;
    overflow-x: auto;
    overflow-y: hidden;
  }

  slider-l > *:not([layout~="disinherit"]) {
    flex-shrink: 0;
    flex-grow: 0;
    height: auto;
    min-width: 0px;
  }

  slider-l > img {
    object-fit: cover;
  }
`;
var sliderHideBarStyle = `
  slider-l[layout~="hide-bar"] {
    overflow: hidden;
  }
`;
var sliderItemWidthStyle = (value) => `
  slider-l[layout~="item-width:${value}"] > *:not([layout~="disinherit"]) {
    flex-basis: ${value};
  }
`;
var sliderHeightStyle = (value) => `
  slider-l[layout~="height:${value}"] > *:not([layout~="disinherit"]) {
    block-size: ${value};
  }
`;
var sliderGapStyle = (value, harmonic) => `
  slider-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;

// src/components/stack.ts
var Stack = class extends Component {
  gap = "";
  recursive = false;
  constructor(layoutClasses) {
    super();
    this.setComponent(layoutClasses);
  }
  getCss(harmonicRatio) {
    const css = [stackStyle];
    if (this.gap) {
      const h = getHarmonic(this.gap, harmonicRatio);
      css.push(stackGapStyle(this.gap, h));
      if (this.recursive) {
        css.push(stackRecursiveStyle(h));
      }
    }
    return css;
  }
};
var stackStyle = `
  stack-l {
    display: block;
  }

  stack-l > * {
    margin-block: 0;
  }
`;
var stackGapStyle = (value, harmonic) => `
  stack-l[layout~="gap:${value}"] > * + *:not([layout~="disinherit"]) {
    margin-block-start: ${harmonic};
  }
`;
var stackRecursiveStyle = (harmonic) => `
  stack-l[layout~="recursive"] * + *:not([layout~="disinherit"]) {
    margin-block-start: ${harmonic};
  }
`;

// src/components/switcher.ts
var Switcher = class extends Component {
  threshold = "";
  limit = "";
  reverse = false;
  gap = "";
  gapX = "";
  gapY = "";
  constructor(layoutClasses) {
    super();
    this.setComponent(layoutClasses);
  }
  getCss(harmonicRatio) {
    const css = [switcherStyle];
    if (this.threshold) {
      css.push(switcherThresholdStyle(this.threshold));
    }
    if (this.limit) {
      css.push(switcherLimitStyle(this.limit));
    }
    if (this.reverse) {
      css.push(switcherReverseStyle);
    }
    if (this.gap) {
      const h = getHarmonic(this.gap, harmonicRatio);
      css.push(switcherGapStyle(this.gap, h));
    }
    if (this.gapX) {
      const h = getHarmonic(this.gapX, harmonicRatio);
      css.push(switcherGapXStyle(this.gapX, h));
    }
    if (this.gapY) {
      const h = getHarmonic(this.gapY, harmonicRatio);
      css.push(switcherGapYStyle(this.gapY, h));
    }
    return css;
  }
};
var switcherStyle = `
  switcher-l {
    display: flex;
    flex-wrap: wrap;
  }

  switcher-l > *:not([layout~="disinherit"]) {
    flex-grow: 1;
    flex-basis:0;
  }
`;
var switcherReverseStyle = `
  switcher-l[layout~="reverse"] {
    flex-wrap: wrap-reverse;
  }
`;
var switcherThresholdStyle = (value) => `
  switcher-l[layout~="threshold:${value}"] > *:not([layout~="disinherit"]) {
    flex-basis: calc((${value} - 100%) * 999);
  }
`;
var switcherLimitStyle = (value) => `
  switcher-l[layout~="limit:${value}"] > :nth-last-child(n+${value}):not([layout~="disinherit"]),
  switcher-l[layout~="limit:${value}"] > :nth-last-child(n+${value}) ~ *:not([layout~="disinherit"]) {
    flex-basis: 100%;
  }
`;
var switcherGapStyle = (value, harmonic) => `
  switcher-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;
var switcherGapXStyle = (value, harmonic) => `
  switcher-l[layout~="gap-x:${value}"] {
    column-gap: ${harmonic};
  }
`;
var switcherGapYStyle = (value, harmonic) => `
  switcher-l[layout~="gap-y:${value}"] {
    row-gap: ${harmonic};
  }
`;

// src/utilities/utility.ts
var Utility = class {
  child = false;
  recursive = false;
  value = "";
  constructor(child, recursive, value = "") {
    this.child = child;
    this.recursive = recursive;
    this.value = value;
  }
};
function transformRecursive(str) {
  const updated = str.replace(/="([^":]+)(?=(:|"))/, '="$1-recursive');
  return updated.replace('"]', '"] *');
}
function transformChild(str) {
  const updated = str.replace(/="([^":]+)(?=(:|"))/, '="$1-child');
  return updated.replace('"]', '"] > *');
}

// src/utilities/align-self.ts
var AlignSelf = class extends Utility {
  getCss() {
    let css = [];
    css.push(alignSelfStyle(this.value));
    return css;
  }
};
var alignSelfStyle = (value) => `
  [layout~="align-self:${value}"] {
    align-self: ${value};
  }
`;

// src/utilities/bg-img.ts
var BgImg = class extends Utility {
  getCss() {
    let css = [bgImgBaseStyle];
    css.push(bgImgStyle(this.value));
    return css;
  }
};
var bgImgStyle = (value) => `
  [layout~="bg-img:${value}"] {
    background-image: url(${value});
  }
  `;
var bgImgBaseStyle = `
  [layout*="bg-img"] {
    background-origin: border-box;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
`;

// src/utilities/flex.ts
var FlexBasis = class extends Utility {
  getCss() {
    let css = [];
    css.push(flexBasisStyle(this.value));
    return css;
  }
};
var flexBasisStyle = (value) => `
  [layout~="flex-basis:${value}"] {
    flex-basis: ${value};
  }
  `;
var FlexGrow = class extends Utility {
  getCss() {
    let css = [];
    css.push(flexGrowStyle(this.value));
    return css;
  }
};
var flexGrowStyle = (value) => `
  [layout~="flex-grow:${value}"] {
    flex-grow: ${value};
  }
  `;
var FlexShrink = class extends Utility {
  getCss() {
    let css = [];
    css.push(flexShrinkStyle(this.value));
    return css;
  }
};
var flexShrinkStyle = (value) => `
  [layout~="flex-shrink:${value}"] {
    flex-shrink: ${value};
  }
  `;

// src/utilities/h.ts
var H = class extends Utility {
  getCss(harmonicRatio) {
    let css = [];
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    css.push(hStyle(this.value, harmonicValue));
    return css;
  }
};
var hStyle = (value, harmonicValue) => `
  [layout~="h:${value}"] {
    height: ${harmonicValue};
  }
  `;

// src/utilities/hide.ts
var HideOver = class extends Utility {
  getCss() {
    let css = [];
    css.push(hideOverStyle(this.value));
    return css;
  }
};
var hideOverStyle = (value) => `
  @media screen and (min-width: ${value}) {
    [layout~="hide-over:${value}"] {
      display: none;
    }
  }
  `;
var HideUnder = class extends Utility {
  getCss() {
    let css = [];
    css.push(hideUnderStyle(this.value));
    return css;
  }
};
var hideUnderStyle = (value) => `
  @media screen and (max-width: ${value}) {
    [layout~="hide-under:${value}"] {
      display: none;
    }
  }
  `;

// src/utilities/line-height.ts
var LineHeight = class extends Utility {
  getCss() {
    let css = [];
    css.push(lineHeightStyle(this.value));
    return css;
  }
};
var lineHeightStyle = (value) => `
  [layout~="line-height:${value}"] {
    line-height: ${value};
  }
  `;

// src/utilities/p.ts
var P = class extends Utility {
  getCss(harmonicRatio) {
    let css = [];
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    css.push(pStyle(this.value, harmonicValue));
    return css;
  }
};
var pStyle = (value, harmonicValue) => `
  [layout~="p:${value}"] {
    padding: ${harmonicValue};
    --pl: ${harmonicValue};
    --pr: ${harmonicValue};
  }
  `;
var Pt = class extends Utility {
  getCss(harmonicRatio) {
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    return [ptStyle(this.value, harmonicValue)];
  }
};
var ptStyle = (value, harmonicValue) => `
  [layout~="pt:${value}"] {
    padding-top: ${harmonicValue};
  }
`;
var Pb = class extends Utility {
  getCss(harmonicRatio) {
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    return [pbStyle(this.value, harmonicValue)];
  }
};
var pbStyle = (value, harmonicValue) => `
  [layout~="pb:${value}"] {
    padding-bottom: ${harmonicValue};
  }
`;
var Pl = class extends Utility {
  getCss(harmonicRatio) {
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    return [plStyle(this.value, harmonicValue)];
  }
};
var plStyle = (value, harmonicValue) => `
  [layout~="pl:${value}"] {
    padding-left: ${harmonicValue};
    --pl: ${harmonicValue};
  }
`;
var Pr = class extends Utility {
  getCss(harmonicRatio) {
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    return [prStyle(this.value, harmonicValue)];
  }
};
var prStyle = (value, harmonicValue) => `
  [layout~="pr:${value}"] {
    padding-right: ${harmonicValue};
    --pr: ${harmonicValue};
  }
`;
var Px = class extends Utility {
  getCss(harmonicRatio) {
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    return [pxStyle(this.value, harmonicValue)];
  }
};
var pxStyle = (value, harmonicValue) => `
  [layout~="px:${value}"] {
    padding-left: ${harmonicValue};
    padding-right: ${harmonicValue};
    --pl: ${harmonicValue};
    --pr: ${harmonicValue};
  }
`;
var Py = class extends Utility {
  getCss(harmonicRatio) {
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    return [pyStyle(this.value, harmonicValue)];
  }
};
var pyStyle = (value, harmonicValue) => `
  [layout~="py:${value}"] {
    padding-top: ${harmonicValue};
    padding-bottom: ${harmonicValue};
  }
`;

// src/utilities/position.ts
var Relative = class extends Utility {
  getCss() {
    let css = [relativeStyle];
    return css;
  }
};
var relativeStyle = `
  [layout~="relative"] {
    position: relative;
  }
`;
var Absolute = class extends Utility {
  getCss() {
    let css = [absoluteStyle];
    return css;
  }
};
var absoluteStyle = `
  [layout~="absolute"] {
    position: absolute;
  }
`;
var Sticky = class extends Utility {
  getCss() {
    let css = [stickyStyle];
    return css;
  }
};
var stickyStyle = `
  [layout~="sticky"] {
    position: sticky;
  }
`;
var Fixed = class extends Utility {
  getCss() {
    let css = [fixedStyle];
    return css;
  }
};
var fixedStyle = `
  [layout~="fixed"] {
    position: fixed;
  }
`;
var Top = class extends Utility {
  getCss(harmonicRatio) {
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    return [topStyle(this.value, harmonicValue)];
  }
};
var topStyle = (value, harmonicValue) => `
  [layout~="top:${value}"] {
    top: ${harmonicValue};
  }
`;
var Bottom = class extends Utility {
  getCss(harmonicRatio) {
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    return [bottomStyle(this.value, harmonicValue)];
  }
};
var bottomStyle = (value, harmonicValue) => `
  [layout~="bottom:${value}"] {
    bottom: ${harmonicValue};
  }
`;
var Left = class extends Utility {
  getCss(harmonicRatio) {
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    return [leftStyle(this.value, harmonicValue)];
  }
};
var leftStyle = (value, harmonicValue) => `
  [layout~="left:${value}"] {
    left: ${harmonicValue};
  }
`;
var Right = class extends Utility {
  getCss(harmonicRatio) {
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    return [rightStyle(this.value, harmonicValue)];
  }
};
var rightStyle = (value, harmonicValue) => `
  [layout~="right:${value}"] {
    right: ${harmonicValue};
  }
`;

// src/utilities/ratio.ts
var Ratio = class extends Utility {
  getCss() {
    let css = [ratioBaseStyle];
    css.push(ratioStyle(this.value));
    return css;
  }
};
var ratioStyle = (value) => `
  [layout~="ratio:${value}"] {
    aspect-ratio: ${value};
  }
  `;
var ratioBaseStyle = `
  img[layout~="ratio"],video[layout~="ratio"] {
    inline-size: 100%;
    object-fit: cover;
  }
`;

// src/utilities/w.ts
var W = class extends Utility {
  getCss(harmonicRatio) {
    let css = [];
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    css.push(wStyle(this.value, harmonicValue));
    return css;
  }
};
var wStyle = (value, harmonicValue) => `
  [layout~="w:${value}"] {
    width: ${harmonicValue};
  }
  `;

// src/utilities/z.ts
var Z = class extends Utility {
  getCss(harmonicRatio) {
    let css = [];
    css.push(wStyle2(this.value));
    return css;
  }
};
var wStyle2 = (value) => `
  [layout~="z:${value}"] {
    z-index: ${value};
  }
  `;

// src/media-query.ts
function cmpMediaQuery(a, b) {
  if (a.type === "SuperiorTo" && b.type === "InferiorOrEqualTo" || a.type === "None" && b.type !== "None") return -1;
  if (a.type === "InferiorOrEqualTo" && b.type === "SuperiorTo" || b.type === "None" && a.type !== "None") return 1;
  if (a.type !== "None" && b.type !== "None") {
    return b.size - a.size;
  }
  return 0;
}

// src/components/area.ts
var Area = class extends Component {
  template = "";
  rows = [];
  cols = [];
  gap = "";
  gapX = "";
  gapY = "";
  constructor(layoutClasses) {
    super();
    this.setComponent(layoutClasses);
    this.rows = layoutClasses.filter((el) => el.startsWith("row-"));
    this.cols = layoutClasses.filter((el) => el.startsWith("col-"));
  }
  getCss(harmonicRatio) {
    const css = [areaStyle];
    if (this.template) {
      const templateAreas = gridTemplateAreasValue(this.template);
      css.push(areaGridTemplateAreasStyle(this.template, templateAreas));
      const uniqueLetters = getUniqueLetters(this.template);
      uniqueLetters.forEach((letter, index) => {
        css.push(areaGridAreaUnitStyle(this.template, letter, index + 1));
      });
      const [rowsNb, colsNb] = countRowsAndCols(this.template);
      if (this.rows.length > 0) {
        const selector = gridTemplateRowsOrColsSelector(this.rows);
        const value = gridTemplateRowsOrColsRule(this.rows, "row-", rowsNb);
        css.push(areaRowsStyle(selector, value, this.template));
      }
      if (this.cols.length > 0) {
        const selector = gridTemplateRowsOrColsSelector(this.cols);
        const value = gridTemplateRowsOrColsRule(this.cols, "col-", colsNb);
        css.push(areaColsStyle(selector, value, this.template));
      }
    }
    if (this.gap) {
      const harmonicValue = getHarmonic(this.gap, harmonicRatio);
      css.push(areaGapStyle(this.gap, harmonicValue));
    }
    if (this.gapX) {
      const harmonicValue = getHarmonic(this.gapX, harmonicRatio);
      css.push(areaGapXStyle(this.gapX, harmonicValue));
    }
    if (this.gapY) {
      const harmonicValue = getHarmonic(this.gapY, harmonicRatio);
      css.push(areaGapYStyle(this.gapY, harmonicValue));
    }
    return css;
  }
};
var areaStyle = `
area-l {
    display: grid;
}
`;
var areaGapStyle = (value, harmonic) => `
area-l[layout~="gap:${value}"] {
    gap: ${harmonic};
}
`;
var areaGapXStyle = (value, harmonic) => `
area-l[layout~="gap-x:${value}"] {
    column-gap: ${harmonic};
}
`;
var areaGapYStyle = (value, harmonic) => `
area-l[layout~="gap-y:${value}"] {
    row-gap: ${harmonic};
}
`;
var areaGridTemplateAreasStyle = (value, template) => `
area-l[layout~="template:${value}"] {
    grid-template-areas: ${template};
}
`;
var areaGridAreaUnitStyle = (value, unit, index) => `
area-l[layout~="template:${value}"] > :nth-child(${index}) {
    grid-area: ${unit};
}
`;
var areaRowsStyle = (selector, value, templateSelector) => `
area-l[layout~="template:${templateSelector}"]${selector} {
    grid-template-rows: ${value};
}
`;
var areaColsStyle = (selector, value, templateSelector) => `
area-l[layout~="template:${templateSelector}"]${selector} {
    grid-template-columns: ${value};
}
`;
var countRowsAndCols = (text) => {
  const rows = (text.match(/\|/g) || []).length + 1;
  const cols = (text.split("|")[0].match(/-/g) || []).length + 1;
  return [rows, cols];
};
var gridTemplateAreasValue = (text) => {
  const areas = [];
  const textWithoutParentheses = text.replace(/[()]/g, "");
  for (const part of textWithoutParentheses.split("|")) {
    const area = part.split("").filter((c) => c !== "-").join(" ");
    areas.push(`"${area}"`);
  }
  return areas.join(" ");
};
var gridTemplateRowsOrColsRule = (items, pattern, number) => {
  const rules = [];
  for (let i = 1; i <= number; i++) {
    const currentPattern = `${pattern}${i}`;
    const item = items.find((s) => s.startsWith(currentPattern));
    if (item) {
      const parts = item.split(":");
      if (parts.length > 1) {
        rules.push(parts[1]);
      } else {
        rules.push("1fr");
      }
    } else {
      rules.push("1fr");
    }
  }
  return rules.join(" ");
};
var gridTemplateRowsOrColsSelector = (items) => {
  const formattedItems = items.map((item) => `[layout~="${item}"]`);
  return formattedItems.join("");
};
var getUniqueLetters = (input) => {
  const uniqueChars = [];
  for (const c of input) {
    if (/[a-zA-Z]/.test(c) && !uniqueChars.includes(c)) {
      uniqueChars.push(c);
    }
  }
  return uniqueChars.sort();
};

// src/utilities/font-size.ts
var FontSize = class extends Utility {
  getCss(harmonicRatio) {
    let css = [];
    const harmonicValue = getHarmonic(this.value, harmonicRatio);
    css.push(fontSizeStyle(this.value, harmonicValue));
    return css;
  }
};
var fontSizeStyle = (value, harmonicValue) => `
  [layout~="fz:${value}"] {
    font-size: ${harmonicValue};
  }
  `;

// src/css/reset.css
var reset_default = "* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nhtml {\n    font-size: 1rem;\n}\n\nbody {\n    container-type: inline-size;\n}\n\nh1, h2, h3, h4, h5, h6 {\n    font-size: inherit;\n    font-weight: normal;\n}\n\nimg {\n    display: block;\n    width: 100%;\n    object-fit: cover;\n}\n\na, a:visited, a:hover, a:active, a:focus {\n    display: inline-block;\n    cursor: pointer;\n    text-decoration: none;\n    color: inherit;\n}\n\ninput, select {\n    display: block;\n    width: 100%;\n}\n\nbutton {\n    cursor: pointer;\n    color: inherit;\n    border: none;\n    font: inherit;\n}\n\nspan, strong, label {\n    display: inline-block;\n}\n";

// src/generator.ts
var componentMap = {
  "area-l": Area,
  "box-l": Box,
  "center-l": Center,
  "extender-l": Extender,
  "grid-l": Grid,
  "rack-l": Rack,
  "sidebar-l": Sidebar,
  "switcher-l": Switcher,
  "row-l": Row,
  "stack-l": Stack,
  "slider-l": Slider
};
var utilityMap = {
  "align-self": AlignSelf,
  "bg-img": BgImg,
  "flex-grow": FlexGrow,
  "flex-basis": FlexBasis,
  "flex-shrink": FlexShrink,
  "h": H,
  "hide-over": HideOver,
  "hide-under": HideUnder,
  "line-height": LineHeight,
  "p": P,
  "pt": Pt,
  "pb": Pb,
  "pl": Pl,
  "pr": Pr,
  "px": Px,
  "py": Py,
  "fz": FontSize,
  "absolute": Absolute,
  "sticky": Sticky,
  "fixed": Fixed,
  "relative": Relative,
  "ratio": Ratio,
  "top": Top,
  "bottom": Bottom,
  "left": Left,
  "right": Right,
  "w": W,
  "z": Z
};
function createComponent(tagName, layoutClasses) {
  const Cls = componentMap[tagName];
  if (!Cls) return void 0;
  return new Cls(layoutClasses);
}
function createUtility(layoutClass) {
  const childIndex = layoutClass.indexOf("-child");
  const recursiveIndex = layoutClass.indexOf("-recursive");
  const colonIndex = layoutClass.indexOf(":");
  let utilityName;
  if (childIndex !== -1) {
    utilityName = layoutClass.substring(0, childIndex);
  } else if (recursiveIndex !== -1) {
    utilityName = layoutClass.substring(0, recursiveIndex);
  } else {
    utilityName = colonIndex !== -1 ? layoutClass.substring(0, colonIndex) : layoutClass;
  }
  const utilityValue = colonIndex !== -1 ? layoutClass.substring(colonIndex + 1) : void 0;
  const Cls = utilityMap[utilityName];
  if (!Cls) return void 0;
  const isChild = childIndex !== -1;
  const isRecursive = recursiveIndex !== -1;
  return new Cls(isChild, isRecursive, utilityValue);
}
function generateElements(tagName, layoutAttributeValue, mediaQuery) {
  const layoutClasses = layoutAttributeValue.trim().split(/\s+/);
  const elements = [];
  let component = createComponent(tagName, layoutClasses);
  if (component) {
    elements.push(component);
  }
  if (mediaQuery.type === "SuperiorTo") {
    return { mediaQuery, elements };
  }
  for (const layoutClass of layoutClasses) {
    const utility = createUtility(layoutClass);
    if (utility) {
      elements.push(utility);
    }
  }
  return { mediaQuery, elements };
}
function generateCss(layoutMap, harmonicRatio) {
  console.log(layoutMap);
  const sortedList = Array.from(layoutMap.entries()).map(([key, value]) => ({
    mediaQuery: JSON.parse(key),
    values: value
  })).sort((a, b) => cmpMediaQuery(a.mediaQuery, b.mediaQuery));
  let cssRules = [reset_default];
  for (const group of sortedList) {
    const mediaQuery = group.mediaQuery;
    let mediaQueryCss = [];
    for (const layoutElement of group.values) {
      let layoutElementCss = layoutElement.getCss(harmonicRatio);
      if (layoutElement instanceof Utility && layoutElement.child) {
        layoutElementCss = layoutElementCss.map(transformChild);
      } else if (layoutElement instanceof Utility && layoutElement.recursive) {
        layoutElementCss = layoutElementCss.map(transformRecursive);
      }
      mediaQueryCss.push(...layoutElementCss);
    }
    if (mediaQuery.type === "InferiorOrEqualTo") {
      const replacedMediaQueryCss = mediaQueryCss.map((css) => css.replace("layout", `layout${mediaQuery.size}px`));
      cssRules.push(`@media (width <= ${mediaQuery.size}px) { ${replacedMediaQueryCss.join("")} }`);
    } else if (mediaQuery.type === "SuperiorTo") {
      cssRules.push(`@media (width > ${mediaQuery.size}px) { ${mediaQueryCss.join("")} }`);
    } else if (group.mediaQuery.type === "None") {
      cssRules.push(mediaQueryCss.join(""));
    }
  }
  console.log(cssRules.join(""));
  return cssRules.join("\n");
}

// src/parser.ts
var Parser = class {
  state = "Resting" /* Resting */;
  text;
  tagNameStart = null;
  tagNameEnd = null;
  attributeNameStart = null;
  attributeNameEnd = null;
  layoutAttributeValueStart = null;
  layoutAttributeValueEnd = null;
  layoutBreakpointAttributeValueStart = null;
  layoutBreakpointAttributeValueEnd = null;
  biggestBreakpoint = 0;
  biggestBreakpointValue = "";
  curlyBracesCounter = 0;
  elements = /* @__PURE__ */ new Map();
  constructor(text) {
    this.text = text;
  }
  sliceText(start, end) {
    if (start === null || end === null || start > end) return "";
    return this.text.slice(start, end + 1);
  }
  tagName() {
    return this.sliceText(this.tagNameStart, this.tagNameEnd);
  }
  attributeName() {
    return this.sliceText(this.attributeNameStart, this.attributeNameEnd);
  }
  isLayoutAttribute() {
    return this.attributeName() === "layout";
  }
  isLayoutBreakpointAttribute() {
    return this.attributeName().startsWith("layout");
  }
  layoutAttributeValue() {
    return this.sliceText(this.layoutAttributeValueStart, this.layoutAttributeValueEnd);
  }
  layoutBreakpointAttributeValue() {
    return this.sliceText(this.layoutBreakpointAttributeValueStart, this.layoutBreakpointAttributeValueEnd);
  }
  resetIndexes() {
    this.tagNameStart = null;
    this.tagNameEnd = null;
    this.attributeNameStart = null;
    this.attributeNameEnd = null;
    this.layoutAttributeValueStart = null;
    this.layoutAttributeValueEnd = null;
    this.layoutBreakpointAttributeValueStart = null;
    this.layoutBreakpointAttributeValueEnd = null;
    this.biggestBreakpoint = 0;
    this.biggestBreakpointValue = "";
    this.curlyBracesCounter = 0;
  }
  updateBiggestBreakpoint(newBreakpoint) {
    if (newBreakpoint <= this.biggestBreakpoint) return;
    this.biggestBreakpoint = newBreakpoint;
    this.biggestBreakpointValue = this.layoutBreakpointAttributeValue();
  }
  extractBreakpoint() {
    const attributeName = this.attributeName();
    if (attributeName.length < "layout".length + 3) return 0;
    const slice = attributeName.slice(6, attributeName.length - 2);
    const parsed = parseInt(slice, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  addElements(elementsInMediaQuery) {
    if (elementsInMediaQuery.elements.length === 0) {
      return;
    }
    const key = JSON.stringify(elementsInMediaQuery.mediaQuery);
    if (this.elements.has(key)) {
      this.elements.get(key).push(...elementsInMediaQuery.elements);
    } else {
      this.elements.set(key, [...elementsInMediaQuery.elements]);
    }
  }
  transition(c) {
    if (this.state === "Resting" /* Resting */ && c === "<") return "InsideTag" /* InsideTag */;
    if (this.state === "InsideTag" /* InsideTag */ && /[a-zA-Z]/.test(c)) return "ReadingTagName" /* ReadingTagName */;
    if ((this.state === "ReadingTagName" /* ReadingTagName */ || this.state === "ReadingAttributeName" /* ReadingAttributeName */) && /\s/.test(c)) return "AfterTagName" /* AfterTagName */;
    if (this.state === "AfterTagName" /* AfterTagName */ && /[a-zA-Z]/.test(c)) return "ReadingAttributeName" /* ReadingAttributeName */;
    if (this.state === "ReadingAttributeName" /* ReadingAttributeName */ && c === "=") return "WaitingAttributeValue" /* WaitingAttributeValue */;
    if (this.state === "WaitingAttributeValue" /* WaitingAttributeValue */ && c === '"') return "ReadingAttributeValue" /* ReadingAttributeValue */;
    if (this.state === "WaitingAttributeValue" /* WaitingAttributeValue */ && c === "{") {
      this.curlyBracesCounter += 1;
      return "ReadingJsxAttributeValue" /* ReadingJsxAttributeValue */;
    }
    if (this.state === "ReadingJsxAttributeValue" /* ReadingJsxAttributeValue */ && c === "{") {
      this.curlyBracesCounter += 1;
    }
    if (this.state === "ReadingJsxAttributeValue" /* ReadingJsxAttributeValue */ && c === "}") {
      this.curlyBracesCounter -= 1;
      if (this.curlyBracesCounter === 0) {
        return "AfterTagName" /* AfterTagName */;
      }
    }
    if (this.state === "WaitingAttributeValue" /* WaitingAttributeValue */ && c !== '"') return "AfterTagName" /* AfterTagName */;
    if (this.state === "ReadingAttributeValue" /* ReadingAttributeValue */ && c === '"') return "AfterTagName" /* AfterTagName */;
    if ((this.state === "AfterTagName" /* AfterTagName */ || this.state === "ReadingTagName" /* ReadingTagName */ || this.state === "ReadingAttributeName" /* ReadingAttributeName */) && c === ">") {
      return "Resting" /* Resting */;
    }
    return this.state;
  }
  parse() {
    for (let i = 0; i < this.text.length; i++) {
      const c = this.text[i];
      const newState = this.transition(c);
      if (this.state === newState) continue;
      if (newState === "ReadingTagName" /* ReadingTagName */) {
        this.tagNameStart = i;
      } else if (this.state === "ReadingTagName" /* ReadingTagName */ && newState === "AfterTagName" /* AfterTagName */) {
        this.tagNameEnd = i - 1;
      } else if (newState === "ReadingAttributeName" /* ReadingAttributeName */) {
        this.attributeNameStart = i;
      } else if (this.state === "ReadingAttributeName" /* ReadingAttributeName */ && newState === "WaitingAttributeValue" /* WaitingAttributeValue */) {
        this.attributeNameEnd = i - 1;
      } else if (newState === "ReadingAttributeValue" /* ReadingAttributeValue */) {
        if (this.isLayoutAttribute()) {
          this.layoutAttributeValueStart = i + 1;
        } else if (this.isLayoutBreakpointAttribute()) {
          this.layoutBreakpointAttributeValueStart = i + 1;
        }
      } else if (this.state === "ReadingAttributeValue" /* ReadingAttributeValue */ && newState === "AfterTagName" /* AfterTagName */) {
        if (this.isLayoutAttribute()) {
          this.layoutAttributeValueEnd = i - 1;
        } else if (this.isLayoutBreakpointAttribute()) {
          this.layoutBreakpointAttributeValueEnd = i - 1;
          const bp = this.extractBreakpoint();
          this.updateBiggestBreakpoint(bp);
          const mq = { type: "InferiorOrEqualTo", size: bp };
          const elements = generateElements(this.tagName(), this.layoutBreakpointAttributeValue(), mq);
          this.addElements(elements);
        }
      } else if (newState === "Resting" /* Resting */) {
        if (this.state === "ReadingTagName" /* ReadingTagName */) {
          this.tagNameEnd = i - 1;
        }
        const elements = generateElements(this.tagName(), this.layoutAttributeValue(), { type: "None" });
        this.addElements(elements);
        if (this.biggestBreakpoint) {
          const mq = {
            type: "SuperiorTo",
            size: this.biggestBreakpoint,
            layoutAttributeValue: this.biggestBreakpointValue
          };
          const elements2 = generateElements(this.tagName(), this.layoutAttributeValue(), mq);
          this.addElements(elements2);
        }
        this.resetIndexes();
      }
      this.state = newState;
    }
  }
};
export {
  Parser,
  generateCss
};
