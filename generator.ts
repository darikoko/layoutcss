
export interface Utility {
    name: string;
    value?: string;
}

function getValue(list:string[], className:string) {
    for (const item of list) {
        if (item.startsWith(className + ':')) {
            return item.split(':')[1].trim();
        }
    }
    return "";
}


export function createLayoutClass(utilityClass:string): Utility{
    const [name, value] = utilityClass.split(":");
    return {
        name,
        value
    }
}

export function createComponent(tagName:string,layoutClasses:string[]){
    if (tagName==="box-l"){
        return new Box("1200px",false)
    }
    if (tagName==="center-l"){
        return new Center("1200px",false, false)
    }
    return undefined
}

export function generateCs(){
    let compo = createComponent("box-l", ["max-width:1200px", "grow"])
    if (compo){
        compo.getCss()
    }
}