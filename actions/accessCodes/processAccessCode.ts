import { handleVersionMismatch } from "actions/versionSync";
import { ActionCreator } from "redux";
import AccessCodeService from "services/AccessCodeService";
import {
  DISPLAY_ACCESS_CODE_RESULT,
  PROCESS_ACCESS_CODE_REQUESTED,
  PROCESS_ACCESS_CODE_SUCCESS,
  PROCESS_ACCESS_CODE_FAILURE,
} from "actiontypes/accessCodes";

import { processMessages } from "actions/app";
import { VersionMismatch } from "services/BaseService";

export type DisplayAccessCodeResult = {
  type: typeof DISPLAY_ACCESS_CODE_RESULT;
  payload: any;
};
export type ProcessAccessCodeRequested = {
  type: typeof PROCESS_ACCESS_CODE_REQUESTED;
};
export type ProcessAccessCodeSuccess = {
  type: typeof PROCESS_ACCESS_CODE_SUCCESS;
  payload: any;
};
export type ProcessAccessCodeFailure = {
  type: typeof PROCESS_ACCESS_CODE_FAILURE;
  payload: any;
};

const displayAccessCodeResult: ActionCreator<DisplayAccessCodeResult> = (
  data
) => ({
  type: DISPLAY_ACCESS_CODE_RESULT,
  payload: data,
});
const processAccessCodeRequest: ActionCreator<
  ProcessAccessCodeRequested
> = () => ({
  type: PROCESS_ACCESS_CODE_REQUESTED,
});
const processAccessCodeSuccess: ActionCreator<ProcessAccessCodeSuccess> = (
  data
) => ({
  type: PROCESS_ACCESS_CODE_SUCCESS,
  payload: data,
});
const processAccessCodeFailure: ActionCreator<ProcessAccessCodeFailure> = (
  error
) => ({
  type: PROCESS_ACCESS_CODE_FAILURE,
  payload: error,
});

const service = new AccessCodeService();

export default function processAccessCode(name: any) {
  return async (dispatch: Function) => {
    dispatch(processAccessCodeRequest());
    try {
      const { data } = await service.processAccessCode(name);
      dispatch(processAccessCodeSuccess(data));
      dispatch(displayAccessCodeResult(data));

      const { isSuccess, messages } = data;
      if (isSuccess && messages) {
        dispatch(processMessages(messages));
      }
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
        return e;
      }
      dispatch(processAccessCodeFailure(e));
    }
  };
}
