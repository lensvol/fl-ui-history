import { createSelector } from "reselect";

import { IAppState } from "types/app";
import { StoryletPhase } from "types/storylet";

function getCanChangeOutfitInArea(state: IAppState): boolean {
  return state.map.currentArea?.canChangeOutfit ?? false;
}

function getCanChangeOutfitInSetting(state: IAppState): boolean {
  return state.map.setting?.canChangeOutfit ?? false;
}

function getCanChangeOutfitInStorylet(state: IAppState): boolean {
  return state.storylet.canChangeOutfit;
}

function getStoryletPhase(state: IAppState) {
  return state.storylet.phase;
}

function outputFn(
  canChangeOutfitInArea: boolean,
  canChangeOutfitInSetting: boolean,
  canChangeOutfitInStorylet: boolean,
  phase: StoryletPhase
) {
  // If this area and setting both lock outfits, then return false
  if (!(canChangeOutfitInArea || canChangeOutfitInSetting)) {
    return false;
  }

  // Otherwise, check slet phase or whether this storylet allows outfit changing
  return phase === "Available" || canChangeOutfitInStorylet;
}

export default createSelector(
  [
    getCanChangeOutfitInArea,
    getCanChangeOutfitInSetting,
    getCanChangeOutfitInStorylet,
    getStoryletPhase,
  ],
  outputFn
);
