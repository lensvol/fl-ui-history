import { createSelector } from "reselect";

import { MAP_ROOT_AREA_THE_FIFTH_CITY } from "features/mapping/constants";

import { IAppState } from "types/app";

const getCurrentArea = (state: IAppState) => state.map.currentArea;
const getSetting = (state: IAppState) => state.map.setting;

const outputFn = (
  currentArea: ReturnType<typeof getCurrentArea>,
  setting: ReturnType<typeof getSetting>
) => {
  if (currentArea?.travelButtonLabel) {
    return currentArea.travelButtonLabel;
  }

  if (setting?.jsonInfo?.travelButtonLabel) {
    return setting.jsonInfo.travelButtonLabel;
  }

  if (!setting?.canTravel) {
    return "View map";
  }

  if (setting?.mapRootArea?.areaKey === MAP_ROOT_AREA_THE_FIFTH_CITY) {
    return "Travel";
  }

  return "View Map";
};

export default createSelector(getCurrentArea, getSetting, outputFn);
