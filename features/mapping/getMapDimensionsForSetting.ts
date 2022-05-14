import { MAP_DIMENSIONS_BY_MAP_ROOT_AREA_ID } from 'features/mapping/constants';
import { IMappableSetting } from 'types/map';

// import { SETTING_ID_THE_FIFTH_CITY } from 'mapping/constants';

export interface IMapDimensions {
  width: number,
  height: number,
}

export default function getMapDimensionsForSetting({ mapRootArea: { areaKey } }: Pick<IMappableSetting, 'mapRootArea'>) {
  return MAP_DIMENSIONS_BY_MAP_ROOT_AREA_ID[areaKey];
}