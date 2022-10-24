import { handleVersionMismatch } from "actions/versionSync";
import * as SettingsActionTypes from "actiontypes/settings";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import SettingsService, { ISettingsService } from "services/SettingsService";

export type RequestPasswordResetRequested = {
  type: typeof SettingsActionTypes.REQUEST_PASSWORD_RESET_REQUESTED;
};
export type RequestPasswordResetFailure = {
  type: typeof SettingsActionTypes.REQUEST_PASSWORD_RESET_FAILURE;
};
export type RequestPasswordResetSuccess = {
  type: typeof SettingsActionTypes.REQUEST_PASSWORD_RESET_SUCCESS;
};

export type RequestPasswordResetActions =
  | RequestPasswordResetRequested
  | RequestPasswordResetFailure
  | RequestPasswordResetSuccess;

export const requestPasswordResetRequested = () => ({
  type: SettingsActionTypes.REQUEST_PASSWORD_RESET_REQUESTED,
});

export const requestPasswordResetSuccess = (_response?: any) => ({
  type: SettingsActionTypes.REQUEST_PASSWORD_RESET_SUCCESS,
});

export const requestPasswordResetFailure = (_error?: any) => ({
  type: SettingsActionTypes.REQUEST_PASSWORD_RESET_FAILURE,
});

export default requestPasswordReset(new SettingsService());

export function requestPasswordReset(service: ISettingsService) {
  return (emailAddress: string) => async (dispatch: Function) => {
    dispatch(requestPasswordResetRequested());

    try {
      const result = await service.requestPasswordReset(emailAddress);
      if (result instanceof Success) {
        dispatch(requestPasswordResetSuccess());
      } else {
        dispatch(requestPasswordResetFailure());
      }
      return result;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
        return e;
      }
      dispatch(requestPasswordResetFailure());
      throw e;
    }
  };
}
