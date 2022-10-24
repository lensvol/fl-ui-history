import { HIDE_MAP } from "actiontypes/map";
import { Dispatch } from "redux";

export type HideMapAction = {
  type: typeof HIDE_MAP;
};

export default function hideMap() {
  return (dispatch: Dispatch) => dispatch({ type: HIDE_MAP });
}
