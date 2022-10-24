import { createSelector } from "reselect";
import { IAppState } from "types/app";
import { IArea, IMappableSetting } from "types/map";
import asStateAwareArea from "features/mapping/asStateAwareArea";

const getAreas: (state: IAppState) => IArea[] = (state: IAppState) =>
  state.map.areas || [];
const getSetting = (state: IAppState) => state.map.setting! as IMappableSetting;
const getCurrentArea: (state: IAppState) => IArea | undefined = (state) =>
  state.map.currentArea;

function outputFunc(
  areas: IArea[],
  setting: IMappableSetting,
  currentArea: IArea | undefined
) {
  return areas.map((a) => asStateAwareArea(a, areas, setting, currentArea));
}

export default createSelector(
  [getAreas, getSetting, getCurrentArea],
  outputFunc
);
