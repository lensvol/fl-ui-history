import { createSelector } from "reselect";
import { IAppState } from "types/app";
import { IQuality } from "types/qualities";

function getQualities(state: IAppState): IQuality[] {
  return state.myself.qualities;
}

function getScripQuality(qualities: IQuality[]): IQuality | undefined {
  if (!isPlayerSufficientlyAdvancedToSeeScrip(qualities)) {
    return undefined;
  }
  return qualities.find((q) => q.id === 125025);
}

function isPlayerSufficientlyAdvancedToSeeScrip(
  qualities: IQuality[]
): boolean {
  const railwayVentureQuality = qualities.find((q) => q.id === 140992);
  return (railwayVentureQuality?.effectiveLevel ?? 0) >= 50;
}

export default createSelector(getQualities, getScripQuality);
