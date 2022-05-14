import { MapActions } from 'actions/map';
import { FetchMyselfSuccess } from 'actions/myself/fetchMyself';
import * as MapActionTypes from 'actiontypes/map';
import * as MyselfActionTypes from 'actiontypes/myself';
import { IMapState } from 'types/map';
import fetchMapSuccess from './fetchMapSuccess';
import setCurrentArea from './setCurrentArea';
import setCurrentSetting from './setCurrentSetting';

/**
 * Initial state
 * @type {Object}
 */
const INITIAL_STATE: IMapState = {
  areas: [],
  currentArea: undefined,
  fallbackMapPreferred: false,
  // itemsUsableHere: false,
  isFetching: false,
  isMoving: false,
  isVisible: false,
  message: null,
  moveMessage: null,
  shouldUpdate: true,
  setting: undefined,
  showOps: false,
  zoomLevel: 0,
};


export default function reducer(state = INITIAL_STATE, action: MapActions | FetchMyselfSuccess): IMapState {
  switch (action.type) {
    case MapActionTypes.HIDE_MAP:
      return {
        ...state,
        isVisible: false,
      };

    case MapActionTypes.TOGGLE_MAP_VIEW:
      return {
        ...state,
        isVisible: !state.isVisible,
      };

    case MapActionTypes.FALLBACK_MAP_PREFERRED:
      return { ...state, fallbackMapPreferred: action.payload.value };

    case MapActionTypes.FETCH_MAP_REQUESTED:
      return { ...state, isFetching: true };

    case MapActionTypes.FETCH_MAP_FAILURE:
      return { ...state, isFetching: false };

    case MapActionTypes.FETCH_MAP_SUCCESS:
      return fetchMapSuccess(state, action);

    case MapActionTypes.CHANGE_LOCATION_REQUESTED:
      return {
        ...state,
        isMoving: true,
        moveMessage: null,
      };

    case MapActionTypes.CHANGE_LOCATION_FAILURE:
      return {
        ...state,
        isMoving: false,
        moveMessage: null,
      };

    case MapActionTypes.CHANGE_LOCATION_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        isMoving: false,
      };

    case MapActionTypes.SET_CURRENT_AREA:
      return setCurrentArea(state, action);

    case MapActionTypes.SET_CURRENT_SETTING:
      return setCurrentSetting(state, action);

    case MapActionTypes.SET_MAP_SHOULD_UPDATE:
      return {
        ...state,
        shouldUpdate: action.payload.shouldUpdate,
      };

    case MyselfActionTypes.FETCH_MYSELF_SUCCESS:
      return {
        ...state,
        setting: action.payload.character.setting,
      };

    default:
      return state;
  }
}
