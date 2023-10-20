import { DEFAULT_CACHED_ZOOM_LEVELS_BY_MAP_ROOT_AREA_ID } from "features/mapping/constants";
import { IMappableSetting } from "types/map";

export default function getCachedZoomLevelForSetting({
  mapRootArea: { areaKey },
}: Pick<IMappableSetting, "mapRootArea">) {
  return DEFAULT_CACHED_ZOOM_LEVELS_BY_MAP_ROOT_AREA_ID[areaKey];
}
