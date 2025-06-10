function isStrictNumber(value: string): boolean {
    const n = parseFloat(value);
    return !isNaN(n) && n.toString() === value;
}

export function getHarmonic(value: string, harmonic: number): string {
    // si c'est une variable CSS
    if (value.startsWith("--")) {
        return `var(${value})`;
    }

    if (value === "none") {
        return "0px";
    }

    if (isStrictNumber((value))) {
        const computed = Math.pow(harmonic, parseFloat(value));
        return `${computed.toFixed(5)}rem`;
    }

    // if it's not a number without unit, (for examaple if it's a css variable)
    // we return the value as it is.
    return value;
}
