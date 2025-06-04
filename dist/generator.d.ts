declare abstract class Component {
    abstract getCss(harmonicRatio: number): string[];
    setComponent(layoutClasses: string[]): void;
    camelToKebab(str: string): string;
    getValue(list: string[], className: string): string;
}

declare abstract class Utility {
    child: boolean;
    recursive: boolean;
    value: string;
    abstract getCss(harmonicRatio: number): string[];
    constructor(child: boolean, recursive: boolean, value?: string);
}

type MediaQuery = {
    type: 'SuperiorTo';
    size: number;
    layoutAttributeValue: string;
} | {
    type: 'InferiorOrEqualTo';
    size: number;
} | {
    type: 'None';
};

interface LayoutElementForCss {
    mediaQuery: MediaQuery;
    elements: (Utility | Component)[];
}
type LayoutElementMap = Map<string, (Utility | Component)[]>;
/**
 * Create a layoutcss Component from a tag-name and a list of layout classes
 **/
declare function createComponent(tagName: string, layoutClasses: string[]): Component | undefined;
/**
 * Create a Utility from a layoutcss class
 **/
declare function createUtility(layoutClass: string): Utility | undefined;
/**
 * Create an array of layoutcss elements (Utility & Component) from a tag-name, a layout attribute and media-query
 **/
declare function generateElements(tagName: string, layoutAttributeValue: string, mediaQuery: MediaQuery): LayoutElementForCss;
/**
 * Create an array of layoutcss elements (Utility & Component) from a tag-name, a layout attribute and media-query
 **/
declare function mergeMapsInPlace(originalMap: LayoutElementMap, newMap: LayoutElementMap): void;
/**
 * Generate Css from a layoutMap and a harmonic ratio
 **/
declare function generateCss(layoutMap: Map<string, (Utility | Component)[]>, harmonicRatio: number): string;

export { type LayoutElementForCss, createComponent, createUtility, generateCss, generateElements, mergeMapsInPlace };
