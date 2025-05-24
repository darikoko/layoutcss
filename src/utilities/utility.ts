export abstract class Utility {
    child: boolean = false;
    recursive: boolean = false;
    value: string = "";

    abstract getCss(harmonicRatio: number): string[];

    constructor( child: boolean, recursive: boolean, value: string="", ) {
        this.child = child;
        this.recursive = recursive;
        this.value = value;
    }
}

export function transformRecursive(str: string): string {
    const updated = str.replace(/="([^":]+)(?=(:|"))/, '="$1-recursive');
    return updated.replace('"]', '"] *');
}

export function transformChild(str: string): string {
    const updated = str.replace(/="([^":]+)(?=(:|"))/, '="$1-child');
    return updated.replace('"]', '"] > *');
}