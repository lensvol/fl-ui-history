/* eslint-disable import/prefer-default-export */
export function stripHtml(theString: string): string {
  const doc = new DOMParser().parseFromString(theString, "text/html");
  return doc.body.textContent || "";
}

/**
 * Remove diacritics from a string by decomposing to a canonical form,
 * so that diacritics become combining diacritics, then removing
 * any characters that match the combining diacritic block
 * (u+0300 -- u+036f); e.g. é -> (e + \u0301) -> e .
 *
 * This won't work on Internet Explorer at all, since it doesn't
 * support String.prototype.normalize; for a browser compatibility
 * table see https://developer.mozilla.org/en-us/docs/web/javascript/reference/global_objects/string/normalize
 * A lookup-table-based approach would work, but would be a lot
 * heftier.
 *
 * @param s
 * @returns {*}
 */
export function stripDiacritics(s: string): string {
  if (String.prototype.normalize !== undefined && s.normalize !== undefined) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return s;
}

export function normalize(s: string): string {
  return stripDiacritics(s.toLowerCase());
}
