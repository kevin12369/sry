// Use spread to count UTF-16 code points (treating emoji + surrogate pairs as 1).
export function countChars(s: string): number {
  return [...s].length;
}
