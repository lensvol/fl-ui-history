import { IArea, SpriteRecord } from 'types/map';
import { isDistrict } from 'features/mapping/index';
import { SPRITE_TYPE_ORDERING } from 'features/mapping/constants';

export default function makeSpriteRecordComparator(areas: IArea[]): (a: SpriteRecord, b: SpriteRecord) => number {
  return (a, b) => {
    const areaA = areas.find(area => area.areaKey === a[0]);
    const areaB = areas.find(area => area.areaKey === b[0]);
    if (areaA && !areaB) {
      return -1;
    }
    if (areaB && !areaA) {
      return 1;
    }
    // District stuff goes under non-district stuff
    if (isDistrict(areaA) && !isDistrict(areaB)) {
      return -1;
    }
    if (isDistrict(areaB) && !isDistrict(areaA)) {
      return 1;
    }

    // If areas have different z-indices, sort them accordingly

    if ((areaA?.zIndex ?? 0) < (areaB?.zIndex ?? 0)) {
      return -1;
    }

    if ((areaB?.zIndex ?? 0) < (areaA?.zIndex ?? 0)) {
      return 1;
    }

    // Break ties on sprite type
    return SPRITE_TYPE_ORDERING[a[1]] - SPRITE_TYPE_ORDERING[b[1]];
  };
}

