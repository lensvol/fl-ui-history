import { MINIMUM_ZOOM_LEVEL_FOR_DESTINATIONS_BY_MAP_ROOT_AREA_ID } from "features/mapping/constants";
import { IMappableSetting } from "types/map";

type HasMapRootArea = Pick<IMappableSetting, "mapRootArea">;

export default function getMinimumZoomLevelForDestinations({
  mapRootArea: { areaKey },
}: HasMapRootArea) {
  return MINIMUM_ZOOM_LEVEL_FOR_DESTINATIONS_BY_MAP_ROOT_AREA_ID[areaKey];
}
