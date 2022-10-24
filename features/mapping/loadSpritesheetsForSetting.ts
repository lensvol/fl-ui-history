import {
  MAP_ROOT_AREA_THE_FIFTH_CITY,
  MAP_ROOT_AREA_THE_UNTERZEE,
  MAP_ROOT_AREA_THE_UNTERZEE_V2,
} from "features/mapping/constants";
import getSpriteSheetFilenamesForSetting from "features/mapping/getSpriteSheetFilenamesForSetting";
import * as PIXI from "pixi.js";
import { IMappableSetting } from "types/map";

const haveWeLoadedThisMapRootArea: { [areaKey: string]: boolean } = {
  [MAP_ROOT_AREA_THE_FIFTH_CITY]: false,
  [MAP_ROOT_AREA_THE_UNTERZEE]: false,
  [MAP_ROOT_AREA_THE_UNTERZEE_V2]: false,
};

export default async function loadSpritesheetsForSetting(
  setting: IMappableSetting,
  onProgress?: (_: any) => void
): Promise<string[]> {
  const spritesheetFilenames = getSpriteSheetFilenamesForSetting(setting);
  const {
    mapRootArea: { areaKey },
  } = setting;

  // We may call this many times over the app's lifetime, since it happens if the user changes their map
  // preference from compat -> non-compat, so we want to make sure that it's idempotent and the actual *loading* only
  // takes place once per setting.
  if (haveWeLoadedThisMapRootArea[areaKey]) {
    // console.info(`We've already loaded sprites for root area ${areaKey}`);
    // If we have an onProgress callback, then tell it we're finished
    if (onProgress) {
      onProgress({ progress: 100 });
    }
    return spritesheetFilenames;
  }
  haveWeLoadedThisMapRootArea[areaKey] = true;

  const loader = PIXI.Loader.shared;

  // If we have an on progress callback to run, set it up now
  if (onProgress) {
    loader.onProgress.add(onProgress);
  }

  // Load the spritesheets
  spritesheetFilenames.forEach((filename) => loader.add(filename));
  await new Promise((resolve) => loader.load(resolve));

  return spritesheetFilenames;
}
