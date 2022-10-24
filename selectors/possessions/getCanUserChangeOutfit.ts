import { createSelector } from "reselect";
import { IAppState } from "types/app";
import { StoryletPhase } from "types/storylet";

type Props = {
  areOutfitsLockable: boolean;
  doesStoryletStateLockOutfits: boolean;
};

function getAreOutfitsLockable(_state: IAppState, props: Props) {
  return props.areOutfitsLockable;
}

function getCanChangeOutfitInArea(state: IAppState): boolean {
  return state.map.currentArea?.canChangeOutfit ?? false;
}

function getCanChangeOutfitInSetting(state: IAppState): boolean {
  return state.map.setting?.canChangeOutfit ?? false;
}

function getCanChangeOutfitInStorylet(state: IAppState): boolean {
  return state.storylet.canChangeOutfit;
}

function getDoesStoryletStateLockOutfits(_state: IAppState, props: Props) {
  return props.doesStoryletStateLockOutfits;
}

function getStoryletPhase(state: IAppState) {
  return state.storylet.phase;
}

function outputFn(
  areOutfitsLockable: boolean,
  canChangeOutfitInArea: boolean,
  canChangeOutfitInSetting: boolean,
  canChangeOutfitInStorylet: boolean,
  doesStoryletStateLockOutfits: boolean,
  phase: StoryletPhase
) {
  // If outfits are not lockable (feature is not enabled) then return true
  if (!areOutfitsLockable) {
    return true;
  }

  // If this area and setting both lock outfits, then return false
  if (!(canChangeOutfitInArea || canChangeOutfitInSetting)) {
    return false;
  }

  // If slet state doesn't lock outfits (feature not enabled) then return true
  if (!doesStoryletStateLockOutfits) {
    return true;
  }

  // Otherwise, check slet phase or whether this storylet allows outfit changing
  return phase === "Available" || canChangeOutfitInStorylet;
}

export default createSelector(
  [
    getAreOutfitsLockable,
    getCanChangeOutfitInArea,
    getCanChangeOutfitInSetting,
    getCanChangeOutfitInStorylet,
    getDoesStoryletStateLockOutfits,
    getStoryletPhase,
  ],
  outputFn
);
