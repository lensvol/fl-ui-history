import getIdealMaximumZoomForSetting from "features/mapping/getIdealMaximumZoomForSetting";
import getIdealMinimumZoomForSetting from "features/mapping/getIdealMinimumZoomForSetting";

import { IMappableSetting, ISetting } from "types/map";

type ZoomLimits = {
  min: number;
  max: number;
};

export default function getMapZoomLimitsForSetting(
  setting: undefined | ISetting
): undefined | ZoomLimits {
  const areaKey = setting?.mapRootArea?.areaKey;

  if (areaKey === undefined) {
    return undefined;
  }

  return {
    min: getIdealMinimumZoomForSetting(setting) ?? 1,
    max: getIdealMaximumZoomForSetting(setting as IMappableSetting),
  };
}
