/**
 * Convenience filter function for running after a find/findIndex that narrows (T | undefined)[] to T[]
 * @param x
 */
export default function isNotUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}
