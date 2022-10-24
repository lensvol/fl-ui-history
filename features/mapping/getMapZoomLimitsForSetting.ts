import {
  IDEAL_MINIMUM_ZOOMS_BY_MAP_ROOT_AREA_ID,
  MAXIMUM_ZOOMS_BY_MAP_ROOT_AREA_ID,
} from "features/mapping/constants";
import { ISetting } from "types/map";

type ZoomLimits = { min: number; max: number };

export default function getMapZoomLimitsForSetting(
  setting: undefined | ISetting
  // setting: undefined | Pick<IMappableSetting, 'mapRootArea'>,
): undefined | ZoomLimits {
  const { areaKey } = setting?.mapRootArea ?? {};

  if (areaKey === undefined) {
    return undefined;
  }

  return {
    min: IDEAL_MINIMUM_ZOOMS_BY_MAP_ROOT_AREA_ID[areaKey],
    max: MAXIMUM_ZOOMS_BY_MAP_ROOT_AREA_ID[areaKey],
  };
}
