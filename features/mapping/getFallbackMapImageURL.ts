import {
  MAP_BASE_URL,
  MAP_ROOT_AREA_THE_FIFTH_CITY,
} from 'features/mapping/constants';
import { isUnterzeeSetting } from 'features/mapping/index';
import { IMappableSetting } from 'types/map';

export type FallbackImageName = 'london' | 'unterzee';


export default function getFallbackMapImageURL(setting: IMappableSetting) {
  return `${MAP_BASE_URL}/fallback/fallback-${getFallbackImageNameForSetting(setting)}.jpg`;
}

function getFallbackImageNameForSetting(setting: IMappableSetting): FallbackImageName {
  if (setting.mapRootArea.areaKey === MAP_ROOT_AREA_THE_FIFTH_CITY) {
    return 'london';
  }

  if (isUnterzeeSetting(setting)) {
    return 'unterzee';
  }

  throw new Error(`I can't find the fallback image name for the Setting "${setting.name}"`)
}
