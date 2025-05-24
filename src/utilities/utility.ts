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