import { NAME_CHANGED } from "actiontypes/myself";
import { Dispatch } from "redux";

export type NameChanged = { type: typeof NAME_CHANGED; payload: string };

export default function nameChanged(name: string) {
  return (dispatch: Dispatch) =>
    dispatch({ type: NAME_CHANGED, payload: name });
}
