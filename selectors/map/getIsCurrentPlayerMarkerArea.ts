import createCachedSelector from 're-reselect';
import findFirstDrawableAreaInHierarchy from 'selectors/map/findFirstDrawableAreaInHierarchy';

import {
  getAreas,
  getCurrentArea,
} from 'selectors/map/inputs';
import { IAppState } from 'types/app';

import { IArea } from 'types/map';

type T = Pick<IArea, 'areaKey' | 'name' | 'parentAreaKey' | 'spriteTopLeftX' | 'spriteTopLeftY'>;

function getArea(_state: IAppState, props: { area: T | undefined }) {
  return props.area;
}

function cacheKey(_state: IAppState, props: { area: T | undefined }) {
  return `${props.area?.areaKey}`;
}

function outputFn(
  area: T | undefined,
  areas: T[],
  currentArea: IArea | undefined,
) {
  return area !== undefined
    && findFirstDrawableAreaInHierarchy(currentArea, areas)?.areaKey === area.areaKey;
}

export default createCachedSelector(getArea, getAreas, getCurrentArea, outputFn)(cacheKey);