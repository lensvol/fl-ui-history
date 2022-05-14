import {
  MAIN_ATTRIBUTES,
} from 'constants/attributes';

// Put this group of qualities into the correct order
export default function sortMainAttributes(a, b) {
  return MAIN_ATTRIBUTES.indexOf(a.name) - MAIN_ATTRIBUTES.indexOf(b.name);
}