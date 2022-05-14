// @ts-ignore
import qs from 'query-string';

export default function didUserRequestCompatibilityInQueryString() {
  let compatibilityInQueryString = false;
  try {
    compatibilityInQueryString = qs.parse(window.location.search)['compatibility'] === 'true';
  } catch (e) {
    // no-op catch is OK here; we don't want to choke on this
    console.error('Failed to parse the query string; continuing');
  }
  return compatibilityInQueryString;
}