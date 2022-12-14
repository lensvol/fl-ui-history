import { IMappableSetting } from "types/map";
import { DEFAULT_CACHED_ZOOM_LEVELS_BY_MAP_ROOT_AREA_ID } from "./constants";

export default function getCachedZoomLevelForSetting({
  mapRootArea: { areaKey },
}: Pick<IMappableSetting, "mapRootArea">) {
  return DEFAULT_CACHED_ZOOM_LEVELS_BY_MAP_ROOT_AREA_ID[areaKey];
}
