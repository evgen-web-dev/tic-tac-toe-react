export function hasValue(...values: any[]): boolean {
    for (const val of values) {
        if (val === null || val === undefined) return false;
    }
    return true;
    
}


export function hasNumericValue(...values: any[]): boolean {
    for (const val of values) {
        if (!hasValue(val) || isNaN(val)) return false;
    }
    return true;
}