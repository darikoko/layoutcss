
export type MediaQuery =
    | { type: 'SuperiorTo'; size: number; layoutAttributeValue: string }
    | { type: 'InferiorOrEqualTo'; size: number }
    | { type: 'None' }


export function cmpMediaQuery(a: MediaQuery, b: MediaQuery): number {
    // Assign priorities to types
    const getPriority = (mq: MediaQuery): number => {
        switch (mq.type) {
            case 'None': return 0;
            case 'SuperiorTo': return 1;
            case 'InferiorOrEqualTo': return 2;
        }
    };

    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    // Compare priorities first
    if (priorityA !== priorityB) {
        return priorityA - priorityB; // Lower priority number comes first
    }

    // If same type and not None, compare sizes in descending order
    if (a.type !== 'None' && b.type !== 'None') {
        return b.size - a.size;
    }

    // If both are None, they are equal
    return 0;
}
