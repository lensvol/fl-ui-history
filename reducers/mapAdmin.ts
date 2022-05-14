import { MAP_CLICKED, MAP_ZOOM_END } from "actiontypes/mapAdmin";

export interface IMapAdminState {
  lastClickX?: number,
  lastClickY?: number,
  zoomLevel?: number,
}

const INITIAL_STATE: IMapAdminState = {};

interface IAction {
  payload: any,
  type: string,
}

export default function reducer(state: IMapAdminState = INITIAL_STATE, { type, payload }: IAction) {
  switch (type) {
    case MAP_CLICKED:
      return { ...state, lastClickX: payload.x, lastClickY: payload.y };
    case MAP_ZOOM_END:
      return { ...state, zoomLevel: payload.zoomLevel};
    default:
      return state;
  }
}