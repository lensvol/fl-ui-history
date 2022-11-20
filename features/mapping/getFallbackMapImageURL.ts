import { IMappableSetting } from "types/map";
import {
  MAP_BASE_URL,
  MAP_ROOT_AREA_THE_FIFTH_CITY,
  MAP_ROOT_AREA_THE_UNTERZEE,
  MAP_ROOT_AREA_THE_UNTERZEE_V2,
} from "./constants";

export type FallbackImageName = "london" | "unterzee";

export default function getFallbackMapImageURL(setting: IMappableSetting) {
  switch (setting.mapRootArea.areaKey) {
    case MAP_ROOT_AREA_THE_UNTERZEE:
    case MAP_ROOT_AREA_THE_UNTERZEE_V2:
      return `${MAP_BASE_URL}/unterzee/background/unterzee-background.jpg`;
    case MAP_ROOT_AREA_THE_FIFTH_CITY:
    default:
      return `${MAP_BASE_URL}/london/fallback/london-fallback.jpg`;
  }
}
