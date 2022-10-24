import { createSelector } from "reselect";
import { IAppState } from "types/app";

const getCurrentArea = (state: IAppState) => state.map.currentArea;

const getSetting = (state: IAppState) => state.map.setting;

const outputFn = (
  currentArea: ReturnType<typeof getCurrentArea>,
  setting: ReturnType<typeof getSetting>
) =>
  (currentArea?.needsProminentTravelButton ?? false) ||
  (setting?.jsonInfo?.needsProminentTravelButton ?? false);

export default createSelector(getCurrentArea, getSetting, outputFn);
