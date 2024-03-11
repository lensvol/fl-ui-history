import { SPRITESHEET_PREFIXES_BY_MAP_ROOT_AREA_ID } from "features/mapping/constants";
import getNumberOfSpritesheetsForSetting from "features/mapping/getNumberOfSpritesheetsForSetting";
import getSpritesheetBaseURL from "features/mapping/getSpritesheetBaseURL";

import { IMappableSetting } from "types/map";

export default function getSpriteSheetFilenamesForSetting(
  setting: IMappableSetting
) {
  const prefix = getPrefixForSetting(setting);
  const baseURL = getSpritesheetBaseURL(prefix);
  const numberOfSpritesheets = getNumberOfSpritesheetsForSetting(setting);

  const spriteSheetFileNames: string[] = [];

  for (let i = 0; i < numberOfSpritesheets; i++) {
    spriteSheetFileNames.push(`${baseURL}/${prefix}-${i}.json`);
  }

  return spriteSheetFileNames;
}

export function getPrefixForSetting(setting: IMappableSetting) {
  if (setting.jsonInfo?.rootPrefix) {
    return setting.jsonInfo.rootPrefix;
  }

  return SPRITESHEET_PREFIXES_BY_MAP_ROOT_AREA_ID[setting.mapRootArea.areaKey];
}
