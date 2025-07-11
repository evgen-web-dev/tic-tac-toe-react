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


export function shuffleArray<T>(arr: T[]): T[] {
  const result = arr.slice();

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}