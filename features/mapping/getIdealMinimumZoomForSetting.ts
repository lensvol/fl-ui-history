import { IDEAL_MINIMUM_ZOOMS_BY_MAP_ROOT_AREA_ID } from "features/mapping/constants";

import { ISetting } from "types/map";

export default function getIdealMinimumZoomForSetting(
  setting: undefined | ISetting
): undefined | number {
  if (setting?.jsonInfo?.minZoom) {
    return setting.jsonInfo.minZoom;
  }

  const areaKey = setting?.mapRootArea?.areaKey;

  if (areaKey === undefined) {
    return undefined;
  }

  return IDEAL_MINIMUM_ZOOMS_BY_MAP_ROOT_AREA_ID[areaKey];
}
