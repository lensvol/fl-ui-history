import getMinimumZoomLevelForDestinations from 'features/mapping/getMinimumZoomLevelForDestinations';
import { isDistrict } from 'features/mapping/index';
import {
  IArea,
  IMappableSetting,
  ISetting,
} from 'types/map';

export const isInteractableAtThisZoomLevel = (
  a: IArea,
  setting: ISetting | undefined,
  zoomLevel: number,
) => {
  if (!setting?.mapRootArea) {
    return false;
  }
  const minZoomLevelForDestinations = getMinimumZoomLevelForDestinations(setting as IMappableSetting);
  return !isDistrict(a) || zoomLevel >= minZoomLevelForDestinations;
};

export default isInteractableAtThisZoomLevel;
