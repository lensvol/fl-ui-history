import { MAP_CLICKED, MAP_ZOOM_END } from "actiontypes/mapAdmin";

export function mapClicked(x: number, y: number) {
  return ( dispatch: Function) => dispatch({type: MAP_CLICKED, payload: { x, y }});
}

export function mapZoomEnd(zoomLevel: number) {
  return (dispatch: Function) => dispatch({ type: MAP_ZOOM_END, payload: { zoomLevel }});
}