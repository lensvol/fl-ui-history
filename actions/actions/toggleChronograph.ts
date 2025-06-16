import { ActionCreator } from "redux";

import { TOGGLE_CHRONOGRAPH_REQUEST } from "actiontypes/actions";

export type ToggleChronographRequested = {
  type: typeof TOGGLE_CHRONOGRAPH_REQUEST;
};

const toggleChronograph: ActionCreator<ToggleChronographRequested> = () => ({
  type: TOGGLE_CHRONOGRAPH_REQUEST,
});

export default toggleChronograph;
