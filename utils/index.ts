export { default as sortByHimble } from "./sortByHimble";
export { default as sortByUsability } from "./sortByUsability";
export { default as stringifyError } from "./stringifyError";
export { default as createEquipmentQualityAltText } from "./createEquipmentQualityAltText";
export { default as isNotUndefined } from "./isNotUndefined";

export const isRoughlyGTE = (a: number, b: number) =>
  a > b || Math.abs(a - b) < 10e-4;
export const isRoughlyLTE = (a: number, b: number) =>
  a < b || Math.abs(a - b) < 10e-4;
