import { getHarmonic } from "../harmonic";
import {Component} from "./component";

export class Grid extends  Component{
    minCellWidth: string = "";
    maxCellWidth: string = "";
    minCols: string = "";
    maxCols: string = "";
    gap: string = "";
    gapX: string = "";
    gapY: string = "";

    constructor(layoutClasses: string[]) {
        super()
        this.setComponent(layoutClasses)
    }

    getCss(harmonicRatio:number): string[] {
        const css = [gridStyle];

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

        // Gestion de min-cell-width
        if (this.minCellWidth && !this.maxCellWidth) {
            const minCols = this.minCols || null;
            const maxCols = this.maxCols || null;

            if (minCols && maxCols) {
                const gapDeltaMin = gapDelta(minCols, this.gap, harmonicRatio);
                const gapDeltaMax = gapDelta(maxCols, this.gap, harmonicRatio);
                const fr = 1.0 / (parseFloat(minCols) || 1);

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

        // Gestion de max-cell-width
        if (this.maxCellWidth && !this.minCellWidth) {
            const minCols = this.minCols || null;
            const maxCols = this.maxCols || null;

            if (minCols && maxCols) {
                const gapDeltaMin = gapDelta(minCols, this.gap, harmonicRatio);
                const gapDeltaMax = gapDelta(maxCols, this.gap, harmonicRatio);

                css.push(
                    gridGroupMaxCellMinColsMaxCols(
                        this.maxCellWidth,
                        minCols,
                        maxCols,
                        gapDeltaMin,
                        gapDeltaMax
                    )
                );
            } else if (minCols && !maxCols) {
                const gapDeltaMin = gapDelta(minCols, this.gap, harmonicRatio);
                css.push(gridGroupMaxCellMinCols(this.maxCellWidth, minCols, gapDeltaMin));
            } else if (!minCols && maxCols) {
                const gapDeltaMax = gapDelta(maxCols, this.gap, harmonicRatio);
                css.push(gridGroupMaxCellMaxCols(this.maxCellWidth, maxCols, gapDeltaMax));
            } else {
                css.push(gridGroupMaxCellEmpty(this.maxCellWidth));
            }
        }

        return css;
    }
}

const gridStyle = `
  grid-l {
    display: grid;
  }
`;

const gridGapStyle = (value: string, harmonic: string) => `
  grid-l[layout~="gap:${value}"] {
    gap: ${harmonic};
  }
`;

const gridGapXStyle = (value: string, harmonic: string) => `
  grid-l[layout~="gap-x:${value}"] {
    column-gap: ${harmonic};
  }
`;

const gridGapYStyle = (value: string, harmonic: string) => `
  grid-l[layout~="gap-y:${value}"] {
    row-gap: ${harmonic};
  }
`;

// Fonctions pour min-cell-width (comportement existant)
const gridGroupEmpty = (minCellWidth: string) => `
  grid-l[layout*="min-cell-width:${minCellWidth}"] {
    grid-template-columns: repeat(auto-fit, minmax(min(${minCellWidth}, 100%), 1fr));
  }
`;

const gridGroupMaxCols = (
    minCellWidth: string,
    maxCols: string,
    gapDeltaMax: string
) => `
  grid-l[layout*="min-cell-width:${minCellWidth}"][layout*="max-cols:${maxCols}"] {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, max(${minCellWidth}, (100% / ${maxCols} - ${gapDeltaMax}))), 1fr));
  }
`;

const gridGroupMinCols = (
    minCellWidth: string,
    minCols: string,
    gapDeltaMin: string
) => `
  grid-l[layout*="min-cell-width:${minCellWidth}"][layout*="min-cols:${minCols}"]:has(:nth-child(${minCols})) {
    grid-template-columns: repeat(auto-fit, minmax(min((100% / ${minCols} - ${gapDeltaMin}), ${minCellWidth}), 1fr));
  }
  grid-l[layout*="min-cell-width:${minCellWidth}"][layout*="min-cols:${minCols}"] {
    grid-template-columns: repeat(${minCols}, 1fr);
  }
`;

const gridGroupMinColsMaxCols = (
    minCellWidth: string,
    minCols: string,
    maxCols: string,
    gapDeltaMin: string,
    gapDeltaMax: string,
    fr: number
) => `
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

// Nouvelles fonctions pour max-cell-width
const gridGroupMaxCellEmpty = (maxCellWidth: string) => `
  grid-l[layout*="max-cell-width:${maxCellWidth}"] {
    grid-template-columns: repeat(auto-fill, minmax(1fr, ${maxCellWidth}));
  }
`;

const gridGroupMaxCellMaxCols = (
    maxCellWidth: string,
    maxCols: string,
    gapDeltaMax: string
) => `
  grid-l[layout*="max-cell-width:${maxCellWidth}"][layout*="max-cols:${maxCols}"] {
    grid-template-columns: repeat(auto-fill, minmax(max(1fr, (100% / ${maxCols} - ${gapDeltaMax})), ${maxCellWidth}));
  }
`;

const gridGroupMaxCellMinCols = (
    maxCellWidth: string,
    minCols: string,
    gapDeltaMin: string
) => `
  grid-l[layout*="max-cell-width:${maxCellWidth}"][layout*="min-cols:${minCols}"]:has(:nth-child(${minCols})) {
    grid-template-columns: repeat(auto-fill, minmax(min((100% / ${minCols} - ${gapDeltaMin}), 1fr), ${maxCellWidth}));
  }
  grid-l[layout*="max-cell-width:${maxCellWidth}"][layout*="min-cols:${minCols}"] {
    grid-template-columns: repeat(${minCols}, minmax(1fr, ${maxCellWidth}));
  }
`;

const gridGroupMaxCellMinColsMaxCols = (
    maxCellWidth: string,
    minCols: string,
    maxCols: string,
    gapDeltaMin: string,
    gapDeltaMax: string
) => `
  grid-l[layout*="max-cell-width:${maxCellWidth}"][layout*="min-cols:${minCols}"][layout*="max-cols:${maxCols}"]:has(:nth-child(${minCols})) {
    grid-template-columns:
      repeat(auto-fill,
        minmax(
          max(
            (100% / ${minCols} - ${gapDeltaMin}),
            min(1fr, (100% / ${maxCols} - ${gapDeltaMax}))
          ),
          ${maxCellWidth}
        )
      );
  }
  grid-l[layout*="max-cell-width:${maxCellWidth}"][layout*="min-cols:${minCols}"][layout*="max-cols:${maxCols}"] {
    grid-template-columns: repeat(${minCols}, minmax(1fr, ${maxCellWidth}));
  }
`;

const gapDelta = (
    cols: string,
    gap: string,
    harmonicRatio: number
): string => {
    if (gap) {
        const colsNumber = parseFloat(cols);
        if (!isNaN(colsNumber)) {
            const hr = getHarmonic(gap, harmonicRatio);
            return `${hr} * (${colsNumber} - 0.98) / ${colsNumber}`;
        }
    }
    return "0px";
};