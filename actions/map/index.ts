import { ChangeLocationAction } from 'actions/map/changeLocation';
import { SetCurrentArea } from 'actions/map/setCurrentArea';
import { SetCurrentSetting } from 'actions/map/setCurrentSetting';
import { SetFallbackMapPreferred } from 'actions/map/setFallbackMapPreferred';
import {
  SET_MAP_SHOULD_UPDATE,
  TOGGLE_MAP_VIEW,
} from 'actiontypes/map';
import { ActionCreator } from 'redux';

import { FetchMapAction } from './fetch';
import { HideMapAction } from './hideMap';

export { default as beginGateEvent } from './beginGateEvent';
export { default as changeLocation } from './changeLocation';
export { default as chooseGateEventBranch } from './chooseGateEventBranch';
export {
  default as fetch,
} from './fetch';
export { default as goBackFromGateEvent } from './goBackFromGateEvent';
export { default as hideMap } from './hideMap';
export { default as setCurrentArea } from './setCurrentArea';
export { default as setCurrentSetting } from './setCurrentSetting';
export { default as setFallbackMapPreferred } from './setFallbackMapPreferred';

export type SetMapShouldUpdate = { type: typeof SET_MAP_SHOULD_UPDATE, payload: { shouldUpdate: boolean } };
export type ToggleMapView = { type: typeof TOGGLE_MAP_VIEW };

export type MapActions
  = ChangeLocationAction
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

export const setMapShouldUpdate: ActionCreator<SetMapShouldUpdate> = (shouldUpdate: boolean) => ({
  type: SET_MAP_SHOULD_UPDATE,
  payload: { shouldUpdate },
});
