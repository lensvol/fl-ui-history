import {
  NUMBER_OF_SPRITESHEETS_BY_MAP_ROOT_AREA_ID,
  SPRITESHEET_PREFIXES_BY_MAP_ROOT_AREA_ID,
} from 'features/mapping/constants';
import getSpritesheetBaseURL from 'features/mapping/getSpritesheetBaseURL';
import { IMappableSetting } from 'types/map';

export default function getSpriteSheetFilenamesForSetting({  mapRootArea }: Pick<IMappableSetting, 'id' | 'mapRootArea'>) {
  const baseURL = getSpritesheetBaseURL({ mapRootArea });
  const numberOfSpritesheets = NUMBER_OF_SPRITESHEETS_BY_MAP_ROOT_AREA_ID[mapRootArea.areaKey];
  const prefix = getPrefixForSetting({ mapRootArea });

  const spriteSheetFileNames: string[] = [];
  for (let i = 0; i < numberOfSpritesheets; i++) {
    spriteSheetFileNames.push(`${baseURL}/${prefix}-${i}.json`);
  }
  return spriteSheetFileNames;
}

function getPrefixForSetting({ mapRootArea: { areaKey } }: Pick<IMappableSetting, 'mapRootArea'>) {
  return SPRITESHEET_PREFIXES_BY_MAP_ROOT_AREA_ID[areaKey];
}
