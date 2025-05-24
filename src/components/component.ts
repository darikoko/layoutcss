export abstract class Component {

    abstract getCss(harmonicRatio: number): string[];

    setComponent(layoutClasses: string[]) {
        for (const [key, value] of Object.entries(this)) {
            const formatedKey = this.camelToKebab(key)
            if (value === "") {
                (this as any)[key] = this.getValue(layoutClasses, formatedKey);
            } else if (value === false) {
                (this as any)[key] = layoutClasses.includes(formatedKey);
            }
        }

    }

    camelToKebab(str: string): string {
        return str
            .replace(/([a-z0-9])([A-Z])/g, "$1-$2") // Ajoute un tiret avant chaque majuscule
            .toLowerCase();
    }

    getValue(list: string[], className: string) {
        for (const item of list) {
            if (item.startsWith(className + ':')) {
                return item.split(':')[1].trim();
            }
        }
        return "";
    }
}