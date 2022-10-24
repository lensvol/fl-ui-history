import { IArea } from "types/map";

export default function isDistrict(a?: IArea) {
  return (a?.type ?? null) === "District";
}
