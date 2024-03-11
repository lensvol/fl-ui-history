import { MAXIMUM_ZOOMS_BY_MAP_ROOT_AREA_ID } from "features/mapping/constants";

import { IMappableSetting } from "types/map";

export default function getIdealMaximumZoomForSetting(
  setting: IMappableSetting
): number {
  if (setting?.jsonInfo?.maxZoom) {
    return setting.jsonInfo.maxZoom;
  }

  return MAXIMUM_ZOOMS_BY_MAP_ROOT_AREA_ID[setting.mapRootArea.areaKey];
}
