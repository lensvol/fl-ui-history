import * as FateActionTypes from "actiontypes/fate";

export type ProcessFateChange = {
  type: typeof FateActionTypes.PROCESS_FATE_CHANGE;
  payload: { fateChangeAmount: number }; // ???
};

function processFateChange(fateChangeAmount: number): ProcessFateChange {
  return {
    type: FateActionTypes.PROCESS_FATE_CHANGE,
    payload: { fateChangeAmount },
  };
}

export default processFateChange;
