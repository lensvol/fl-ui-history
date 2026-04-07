import { MD } from "components/Responsive/breakpoints";

import { getMapDimensionsForSetting } from "features/mapping/index";

import { IMappableSetting } from "types/map";

export default function getMinimumZoomThatFits(
  { innerWidth, innerHeight }: Window,
  setting: undefined | IMappableSetting
) {
  const { mapRootArea } = setting ?? {};

  if (!mapRootArea) {
    return undefined;
  }

  const { height: mapHeight } = getMapDimensionsForSetting(setting!);

  // On sufficiently wide screens, we can show the map fully zoomed out
  if (innerWidth >= MD) {
    return 3;
  }

  // Otherwise, we need to show a zoom level that will fill the screen
  return 5 + Math.log2(innerHeight / mapHeight);
}
