import {Component} from "./components/component";
import {Grid} from "./components/grid";
import {Extender} from "./components/extender";
import {Rack} from "./components/rack";
import {Row} from "./components/row";
import {Sidebar} from "./components/sidebar";
import {Center} from "./components/center";
import {Box} from "./components/box";
import {Slider} from "./components/slider";
import {Stack} from "./components/stack";
import {Switcher} from "./components/switcher";

import {MediaQuery} from "./media-query";

import {Utility} from "./utilities/utility";
import {AlignSelf} from "./utilities/align-self";
import {BgImg} from "./utilities/bg-img";
import {FlexBasis, FlexGrow, FlexShrink} from "./utilities/flex";
import {H} from "./utilities/h";
import {HideOver, HideUnder} from "./utilities/hide";
import {LineHeight} from "./utilities/line-height";
import {P, Pb, Pl, Pr, Pt, Px, Py} from "./utilities/p";
import {Absolute, Fixed, Relative, Sticky} from "./utilities/position";
import {Ratio} from "./utilities/ratio";
import {W} from "./utilities/w";
import {Z} from "./utilities/z";

export interface LayoutElementForCss {
    mediaQuery?: MediaQuery,
    elements: (Utility | Component)[]
}

const componentMap: Record<string, new (...args: any[]) => any> = {
    "box-l": Box,
    "center-l": Center,
    "extender-l": Extender,
    "grid-l": Grid,
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
    "py":Py,
    "absolute": Absolute,
    "sticky": Sticky,
    "fixed": Fixed,
    "relative": Relative,
    "ratio": Ratio,
    "w": W,
    "z": Z,
};

export function createComponent(tagName: string, layoutClasses: string[]) {
    const Cls = componentMap[tagName];
    if (!Cls) return undefined;
    return new Cls(layoutClasses);
}

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
        utilityName = colonIndex !==-1 ? layoutClass.substring(0, colonIndex) : layoutClass;
    }

    const utilityValue =  colonIndex !==-1 ? layoutClass.substring(colonIndex + 1) : undefined;

    const Cls = utilityMap[utilityName];
    if (!Cls) return undefined;
    const isChild =  childIndex !== -1;
    const isRecursive =  recursiveIndex !== -1;
    return new Cls(isChild, isRecursive, utilityValue);
}


export function generateElements(tagName: string, layoutAttributeValue: string, mediaQuery: MediaQuery): LayoutElementForCss {
    const layoutClasses = layoutAttributeValue.trim().split(/\s+/);
    const elements : (Utility | Component)[] = []
    let component = createComponent(tagName,layoutClasses)
    if (component){
        elements.push(component)
    }
    // we dont want to add utility for superiorTo because its herited between breakpoint
    if (mediaQuery.type=== "SuperiorTo"){
        return {mediaQuery: mediaQuery, elements: elements};
    }
    // si on a un media query superieur on passe les utilities qui doivent être hérité
    for (const layoutClass of layoutClasses) {
        const utility = createUtility(layoutClass)
        if (utility) {
            elements.push(utility)
        }
    }
    return {mediaQuery: mediaQuery, elements: elements};

}