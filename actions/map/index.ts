import { ActionCreator } from "redux";

import { ChangeLocationAction } from "actions/map/changeLocation";
import { FetchMapAction } from "actions/map/fetch";
import { HideMapAction } from "actions/map/hideMap";
import { SetCurrentArea } from "actions/map/setCurrentArea";
import { SetCurrentSetting } from "actions/map/setCurrentSetting";
import { SetFallbackMapPreferred } from "actions/map/setFallbackMapPreferred";

import { SET_MAP_SHOULD_UPDATE, TOGGLE_MAP_VIEW } from "actiontypes/map";

export { default as beginGateEvent } from "actions/map/beginGateEvent";
export { default as changeLocation } from "actions/map/changeLocation";
export { default as chooseGateEventBranch } from "actions/map/chooseGateEventBranch";
export { default as fetchMap } from "actions/map/fetch";
export { default as goBackFromGateEvent } from "actions/map/goBackFromGateEvent";
export { default as hideMap } from "actions/map/hideMap";
export { default as setCurrentArea } from "actions/map/setCurrentArea";
export { default as setCurrentSetting } from "actions/map/setCurrentSetting";
export { default as setFallbackMapPreferred } from "actions/map/setFallbackMapPreferred";

type SetMapShouldUpdate = {
  type: typeof SET_MAP_SHOULD_UPDATE;
  payload: {
    shouldUpdate: boolean;
  };
};

type ToggleMapView = {
  type: typeof TOGGLE_MAP_VIEW;
};

export type MapActions =
  | ChangeLocationAction
  | FetchMapAction
  | HideMapAction
  | SetCurrentArea
  | SetCurrentSetting
  | SetFallbackMapPreferred
  | SetMapShouldUpdate
  | ToggleMapView;

export const toggleMapView: ActionCreator<ToggleMapView> = () => ({
  type: TOGGLE_MAP_VIEW,
});

export const setMapShouldUpdate: ActionCreator<SetMapShouldUpdate> = (
  shouldUpdate: boolean
) => ({
  type: SET_MAP_SHOULD_UPDATE,
  payload: {
    shouldUpdate,
  },
});
