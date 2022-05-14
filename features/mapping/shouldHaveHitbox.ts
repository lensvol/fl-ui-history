import { IArea, IMappableSetting, ISetting } from 'types/map';
import getMinimumZoomLevelForDestinations from 'features/mapping/getMinimumZoomLevelForDestinations';
import { isDistrict } from 'features/mapping/index';

// Districts always have hitboxes (either for the whole district, or for their main destination);
// destinations only have hitboxes above the zoom threshold
export const shouldHaveHitbox = (area: IArea, setting: ISetting | undefined, zoomLevel: number) => {
  if (!setting?.mapRootArea) {
    return false;
  }
  return isDistrict(area) || zoomLevel >= getMinimumZoomLevelForDestinations(setting as IMappableSetting);
};

export default shouldHaveHitbox;
