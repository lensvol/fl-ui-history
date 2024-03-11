import { MAP_DIMENSIONS_BY_MAP_ROOT_AREA_ID } from "features/mapping/constants";

import { IMappableSetting } from "types/map";

export interface IMapDimensions {
  width: number;
  height: number;
}

export default function getMapDimensionsForSetting({
  jsonInfo,
  mapRootArea,
}: Pick<IMappableSetting, "jsonInfo" | "mapRootArea">): IMapDimensions {
  if (jsonInfo?.height && jsonInfo?.width) {
    return {
      height: jsonInfo.height,
      width: jsonInfo.width,
    };
  }

  return MAP_DIMENSIONS_BY_MAP_ROOT_AREA_ID[mapRootArea.areaKey];
}
