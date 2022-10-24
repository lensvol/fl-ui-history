import { isLodgings, isSubLodgings, shouldAppearOnMap } from "features/mapping";
import { createSelector } from "reselect";
import { IAppState } from "types/app";
import { IStateAwareArea, ISetting } from "types/map";

function getCurrentArea(state: IAppState): IStateAwareArea | undefined {
  return state.map.currentArea;
}

function getAreas(state: IAppState): IStateAwareArea[] | undefined {
  return state.map.areas;
}

function getSetting(state: IAppState): ISetting | undefined {
  return state.map.setting;
}

function isPlayerInLimbo(
  currentArea: IStateAwareArea | undefined,
  areas: IStateAwareArea[] | undefined,
  _setting: ISetting | undefined
): boolean {
  if (!(currentArea && areas)) {
    return false;
  }

  if (isLodgings(currentArea) || isSubLodgings(currentArea, areas)) {
    return false;
  }

  return !shouldAppearOnMapRecursive(currentArea, areas);
}

function shouldAppearOnMapRecursive(
  area: IStateAwareArea | undefined,
  areas: IStateAwareArea[]
): boolean {
  if (!area) {
    return false;
  }

  if (shouldAppearOnMap(area)) {
    return true;
  }

  if (!area.parentArea) {
    return false;
  }

  return shouldAppearOnMapRecursive(
    areas.find((b) => b.areaKey === area.parentArea?.areaKey),
    areas
  );
}

export default createSelector(
  [getCurrentArea, getAreas, getSetting],
  isPlayerInLimbo
);
