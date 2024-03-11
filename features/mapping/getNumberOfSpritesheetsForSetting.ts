import { NUMBER_OF_SPRITESHEETS_BY_MAP_ROOT_AREA_ID } from "features/mapping/constants";

import { IMappableSetting } from "types/map";

export default function getNumberOfSpritesheetsForSetting(
  setting: IMappableSetting
) {
  if (setting.jsonInfo?.spriteSheetCount) {
    return setting.jsonInfo.spriteSheetCount;
  }

  return NUMBER_OF_SPRITESHEETS_BY_MAP_ROOT_AREA_ID[
    setting.mapRootArea.areaKey
  ];
}
