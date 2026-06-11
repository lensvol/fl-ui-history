import { MD } from "components/Responsive/breakpoints";

import getIdealMaximumZoomForSetting from "features/mapping/getIdealMaximumZoomForSetting";
import getIdealMinimumZoomForSetting from "features/mapping/getIdealMinimumZoomForSetting";
import { getMapDimensionsForSetting } from "features/mapping/index";

import { IMappableSetting } from "types/map";

export default function getMinimumZoomThatFits(
  window: Window,
  setting?: IMappableSetting
) {
  if (!setting || !setting.mapRootArea) {
    return undefined;
  }

  // On sufficiently wide screens, we can show the map fully zoomed out
  if (window.innerWidth >= MD) {
    return getIdealMinimumZoomForSetting(setting);
  }

  const baseZoomLevel = getIdealMaximumZoomForSetting(setting);
  const { height: mapHeight } = getMapDimensionsForSetting(setting);

  // Otherwise, we need to show a zoom level that will fill the screen
  return baseZoomLevel + Math.log2(window.innerHeight / mapHeight);
}
