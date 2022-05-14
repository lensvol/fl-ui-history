import { isDrawable } from 'features/mapping';
import { IStateAwareArea } from 'types/map';

type T = Pick<IStateAwareArea, 'areaKey' | 'parentArea' | 'spriteTopLeftX' | 'spriteTopLeftY'>;

export default function findFirstDrawableAreaInHierarchy(a: T | undefined, areas: T[]): T | null {
  // If we were passed undefined, return null
  if (!a) {
    return null;
  }

  // If we're looking at a drawable area, return it
  if (isDrawable(a)) {
    return a;
  }

  const { parentArea } = a;

  // If this is the top of the hierarchy, return null
  if (!parentArea) {
    return null;
  }

  // Recurse
  return findFirstDrawableAreaInHierarchy(areas.find(b => b.areaKey === parentArea.areaKey), areas);
}