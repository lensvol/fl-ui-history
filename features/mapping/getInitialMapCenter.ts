import { MAP_CENTER_BY_MAP_ROOT_AREA_ID } from "features/mapping/constants";

import { IMappableSetting } from "types/map";

export interface IMapCenterDimensions {
  initPercentX: number;
  initPercentY: number;
}

export default function getInitialMapCenter(
  setting: IMappableSetting
): IMapCenterDimensions {
  const jsonInfoInitPercentX = setting?.jsonInfo?.initPercentX;
  const jsonInfoInitPercentY = setting?.jsonInfo?.initPercentY;

  const areaKey = setting?.mapRootArea?.areaKey;
  const areaKeyInitCenter =
    areaKey === undefined ? undefined : MAP_CENTER_BY_MAP_ROOT_AREA_ID[areaKey];

  const areaKeyInitPercentX =
    areaKeyInitCenter === undefined ? undefined : areaKeyInitCenter.percentX;
  const areaKeyInitPercentY =
    areaKeyInitCenter === undefined ? undefined : areaKeyInitCenter.percentY;

  return {
    initPercentX: jsonInfoInitPercentX ?? areaKeyInitPercentX ?? 50,
    initPercentY: jsonInfoInitPercentY ?? areaKeyInitPercentY ?? 0, // maintain behaviour of old bug
  };
}
