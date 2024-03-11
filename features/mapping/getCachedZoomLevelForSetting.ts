import getIdealMinimumZoomForSetting from "features/mapping/getIdealMinimumZoomForSetting";

import { IMappableSetting } from "types/map";

export default function getCachedZoomLevelForSetting(
  setting: IMappableSetting
) {
  return getIdealMinimumZoomForSetting(setting) ?? 1;
}
