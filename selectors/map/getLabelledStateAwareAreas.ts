import { isLabelled } from 'features/mapping';
import { createSelector } from 'reselect';
import asStateAwareArea from 'features/mapping/asStateAwareArea';
import { IArea, ILabelledStateAwareArea, IMappableSetting } from 'types/map';
import {
  getAreas,
  getCurrentArea,
  getSetting,
} from 'selectors/map/inputs';

const outputFn = (areas: IArea[], setting: IMappableSetting, currentArea: IArea | undefined) => {
  return areas
    .filter(isLabelled)
    .map(a => asStateAwareArea(a, areas, setting, currentArea) as ILabelledStateAwareArea);
};

export default createSelector([getAreas, getSetting, getCurrentArea], outputFn);