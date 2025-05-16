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
        return "0.0";
    }

    if (isStrictNumber((value))) {
        const computed = Math.pow(harmonic, parseFloat(value));
        return `${computed.toFixed(5)}rem`;
    }

    // si ce n'est pas un nombre sans unité, on retourne la valeur telle quelle
    return value;
}
