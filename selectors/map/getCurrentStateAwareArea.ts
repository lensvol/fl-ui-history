import { createSelector } from "reselect";
import asStateAwareArea from "features/mapping/asStateAwareArea";
import { IArea, IMappableSetting, IStateAwareArea } from "types/map";
import { getAreas, getCurrentArea, getSetting } from "selectors/map/inputs";

function outputFunc(
  areas: IArea[],
  setting: IMappableSetting,
  currentArea: IArea | undefined
): IStateAwareArea | undefined {
  if (!currentArea) {
    return currentArea;
  }
  return asStateAwareArea(currentArea, areas, setting, currentArea);
}

export default createSelector(
  [getAreas, getSetting, getCurrentArea],
  outputFunc
);
