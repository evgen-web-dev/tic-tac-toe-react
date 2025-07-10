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


export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // remove anything that isn’t a letter, number, space or hyphen
    .replace(/[^\w\s-]/g, '')
    // replace runs of spaces, underscores, or hyphens with a single hyphen
    .replace(/[\s_-]+/g, '-')
    // remove leading or trailing hyphens
    .replace(/^-+|-+$/g, '');
}