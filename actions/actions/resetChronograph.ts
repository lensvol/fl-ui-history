import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import { RESET_CHRONOGRAPH_SUCCESS } from "actiontypes/actions";

import ActionsService from "services/ActionsService";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";

import { IActionsService } from "types/actions";

export type ResetChronographSuccess = {
  type: typeof RESET_CHRONOGRAPH_SUCCESS;
};

const resetChronographSuccess: ActionCreator<ResetChronographSuccess> = () => ({
  type: RESET_CHRONOGRAPH_SUCCESS,
});

export default resetChronograph(new ActionsService());

export function resetChronograph(service: IActionsService) {
  return () => async (dispatch: Function) => {
    try {
      // dispatch(abandonPlotRequested());

      const result = await service.resetChronograph();

      if (result instanceof Success) {
        dispatch(resetChronographSuccess(result.data));
      }

      return result;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));

        return;
      }

      throw e;
    }
  };
}
