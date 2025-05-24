
export type MediaQuery =
    | { type: 'SuperiorTo'; size: number; layoutAttributeValue: string }
    | { type: 'InferiorOrEqualTo'; size: number }
    | { type: 'None' }

export function cmpMediaQuery(a: MediaQuery, b: MediaQuery): number {
    if ((a.type === 'SuperiorTo' && b.type === 'InferiorOrEqualTo') || (a.type === 'None' && b.type !== 'None')) return 1;
    if (a.type === 'InferiorOrEqualTo' && b.type === 'SuperiorTo' || (b.type === 'None' && a.type !== 'None')) return -1;
    if (a.type !== 'None' && b.type !== 'None') {
        return b.size - a.size
    }
    return 0
}