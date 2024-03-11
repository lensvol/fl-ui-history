import { MINIMUM_ZOOM_LEVEL_FOR_DESTINATIONS_BY_MAP_ROOT_AREA_ID } from "features/mapping/constants";

import { IMappableSetting } from "types/map";

export default function getMinimumZoomLevelForDestinations(
  setting: IMappableSetting
) {
  if (setting?.jsonInfo?.minDestZoom) {
    return setting.jsonInfo.minDestZoom;
  }

  return MINIMUM_ZOOM_LEVEL_FOR_DESTINATIONS_BY_MAP_ROOT_AREA_ID[
    setting.mapRootArea.areaKey
  ];
}
