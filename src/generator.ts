import {Component} from "./components/component.js";
import {Grid} from "./components/grid.js";
import {Extender} from "./components/extender.js";
import {Rack} from "./components/rack.js";
import {Row} from "./components/row.js";
import {Sidebar} from "./components/sidebar.js";
import {Center} from "./components/center.js";
import {Box} from "./components/box.js";
import {Slider} from "./components/slider.js";
import {Stack} from "./components/stack.js";
import {Switcher} from "./components/switcher.js";

import {transformChild, transformRecursive, Utility} from "./utilities/utility.js";
import {AlignSelf} from "./utilities/align-self.js";
import {BgImg} from "./utilities/bg-img.js";
import {FlexBasis, FlexGrow, FlexShrink} from "./utilities/flex.js";
import {H} from "./utilities/h.js";
import {HideOver, HideUnder} from "./utilities/hide.js";
import {LineHeight} from "./utilities/line-height.js";
import {P, Pb, Pl, Pr, Pt, Px, Py} from "./utilities/p.js";
import {Absolute, Bottom, Fixed, Left, Relative, Right, Sticky, Top} from "./utilities/position.js";
import {Ratio} from "./utilities/ratio.js";
import {W} from "./utilities/w.js";
import {Z} from "./utilities/z.js";
import {cmpMediaQuery, MediaQuery} from "./media-query.js";
import {Area} from "./components/area.js";
import {FontSize} from "./utilities/font-size.js";

import RESET_CSS from './css/reset.css'
import { Overflow, OverflowX, OverflowY } from "./utilities/overflow.js";
import { TextAlign } from "./utilities/text-align.js";
import { Col } from "./components/col.js";
import { Middle } from "./components/middle.js";




export interface LayoutElementForCss {
    mediaQuery: MediaQuery,
    elements: (Utility | Component)[]
}

type LayoutElementMap = Map<string, (Utility | Component)[]>;

const componentMap: Record<string, new (...args: any[]) => any> = {
    "area-l": Area,
    "box-l": Box,
    "center-l": Center,
    "col-l": Col,
    "extender-l": Extender,
    "grid-l": Grid,
    "middle-l": Middle,
    "rack-l": Rack,
    "sidebar-l": Sidebar,
    "switcher-l": Switcher,
    "row-l": Row,
    "stack-l": Stack,
    "slider-l": Slider,
};

const utilityMap: Record<string, new (...args: any[]) => any> = {
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
    "font-size": FontSize,
    "fz": FontSize, // alias for font-size
    "text": TextAlign,
    "overflow": Overflow,
    "of": Overflow, // alias for overflow
    "overflow-x": OverflowX,
    "ofx": OverflowX, // alias for overflow-x
    "overflow-y": OverflowY,
    "ofy": OverflowY, // alias for overflow-y
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
    "z-index": Z,
    "z": Z, // alias for z-index
};

/**
 * Create a layoutcss Component from a tag-name and a list of layout classes
 **/
export function createComponent(tagName: string, layoutClasses: string[]): Component | undefined {
    const Cls = componentMap[tagName];
    if (!Cls) return undefined;
    return new Cls(layoutClasses);
}

/**
 * Create a Utility from a layoutcss class
 **/
export function createUtility(layoutClass: string): Utility | undefined {
    const childIndex = layoutClass.indexOf("-child");
    const recursiveIndex = layoutClass.indexOf("-recursive");
    const colonIndex = layoutClass.indexOf(":");

    let utilityName: string;

    if (childIndex !== -1) {
        utilityName = layoutClass.substring(0, childIndex);
    } else if (recursiveIndex !== -1) {
        utilityName = layoutClass.substring(0, recursiveIndex);
    } else {
        utilityName = colonIndex !== -1 ? layoutClass.substring(0, colonIndex) : layoutClass;
    }

    const utilityValue = colonIndex !== -1 ? layoutClass.substring(colonIndex + 1) : undefined;

    const Cls = utilityMap[utilityName];
    if (!Cls) return undefined;
    const isChild = childIndex !== -1;
    const isRecursive = recursiveIndex !== -1;
    return new Cls(isChild, isRecursive, utilityValue);
}


/**
 * Create an array of layoutcss elements (Utility & Component) from a tag-name, a layout attribute and media-query
 **/
export function generateElements(tagName: string, layoutAttributeValue: string, mediaQuery: MediaQuery, hasBiggestBreakpoint:boolean): LayoutElementForCss {
    const layoutClasses = layoutAttributeValue.trim().split(/\s+/);
    const elements: (Utility | Component)[] = []
    let component = createComponent(tagName, layoutClasses)
    // if we are in the None MediaQuery and the component has a Biggest Breakpoint we dont want
    // to add it to the None MediaQuery, we only want it into SuperiorTo and InferiorOrEqualTo
    if (component && !(mediaQuery.type=== "None" && hasBiggestBreakpoint)) {
        elements.push(component)
    }
    // we dont want to add utility for superiorTo because its inherited between breakpoints
    if (mediaQuery.type === "SuperiorTo") {
        return {mediaQuery: mediaQuery, elements: elements};
    }
    // if we have a InferiorOrEqualTo media-query we pass utilities which should be inherited
    for (const layoutClass of layoutClasses) {
        const utility = createUtility(layoutClass)
        if (utility) {
            elements.push(utility)
        }
    }
    return {mediaQuery: mediaQuery, elements: elements};

}


/**
 * Create an array of layoutcss elements (Utility & Component) from a tag-name, a layout attribute and media-query
 **/
export function mergeMapsInPlace(originalMap: LayoutElementMap, newMap: LayoutElementMap) {
    for (const [key, value] of newMap) {
        // we check if this media query key already exists in originalMap
        let existingKey = originalMap.get(key);
        // if the key exist, we merge the elements from the new media query and the original
        // and then we removeDuplicates
        if (existingKey) {
            originalMap.set(key, removeDuplicates([...existingKey,...value]));
        } else {
            originalMap.set(key, removeDuplicates([...value]));
        }
    }
}


/**
 * Check if 2 layout elements are the same based on their values
 **/
function shallowEqual(a: Utility | Component, b: Utility | Component) :boolean{
    if (a.constructor !== b.constructor){
        return false
    }
    const keys1 = Object.keys(a);
    const keys2 = Object.keys(b);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => b.hasOwnProperty(key) && (a as any)[key] === (b as any)[key]);
}



/**
 * Generate Css from a layoutMap and a harmonic ratio
 **/
export function generateCss(layoutMap: Map<string, (Utility | Component)[]>, harmonicRatio: number): string {
    const sortedList = Array.from(layoutMap.entries()).map(([key, value]) => ({
        mediaQuery: JSON.parse(key) as MediaQuery,
        values: value
    })).sort((a, b) => cmpMediaQuery(a.mediaQuery, b.mediaQuery));
    let cssRules: string[] = [RESET_CSS]
    for (const group of sortedList) {
        const mediaQuery = group.mediaQuery;
        // the css of all the media query
        let mediaQueryCss: string[] = []
        for (const layoutElement of group.values) {
            // the css of the current layout element
            let layoutElementCss = layoutElement.getCss(harmonicRatio)
            if (layoutElement instanceof Utility && layoutElement.child) {
                layoutElementCss = layoutElementCss.map(transformChild)
            } else if (layoutElement instanceof Utility && layoutElement.recursive) {
                layoutElementCss = layoutElementCss.map(transformRecursive)
            }
            else if (layoutElement instanceof Component && mediaQuery.type === "SuperiorTo") {
                layoutElementCss = layoutElementCss.map(css => css.replace("-l", `-l[layout${mediaQuery.size}px="${mediaQuery.layoutAttributeValue}"]`))
            }
            mediaQueryCss.push(...layoutElementCss)
        }
        if (mediaQuery.type === "InferiorOrEqualTo") {
            const replacedMediaQueryCss = mediaQueryCss.map(css => css.replace("layout", `layout${mediaQuery.size}px`));
            cssRules.push(`@media (width <= ${mediaQuery.size}px) { ${replacedMediaQueryCss.join('')} }`)
        } else if (mediaQuery.type === "SuperiorTo") {
            cssRules.push(`@media (width > ${mediaQuery.size}px) { ${mediaQueryCss.join('')} }`)
        }
        else if (group.mediaQuery.type === "None") {
            cssRules.push(mediaQueryCss.join(''))
        }

    }
    
    return cssRules.join("\n")
}

function removeDuplicates(list: (Utility | Component)[]): (Utility | Component)[] {
    const result: (Utility | Component)[] = [];
    for (const item of list) {
        if (!result.some(existing => shallowEqual(existing, item))) {
            result.push(item);
        }
    }
    return result;
}