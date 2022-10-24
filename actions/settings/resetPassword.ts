import { handleVersionMismatch } from "actions/versionSync";
import * as SettingsActionTypes from "actiontypes/settings";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import SettingsService, {
  ISettingsService,
  ResetPasswordRequest,
} from "services/SettingsService";

export type ResetPasswordRequested = {
  type: typeof SettingsActionTypes.PASSWORD_RESET_REQUESTED;
};
export type ResetPasswordFailure = {
  type: typeof SettingsActionTypes.PASSWORD_RESET_FAILURE;
};
export type ResetPasswordSuccess = {
  type: typeof SettingsActionTypes.PASSWORD_RESET_SUCCESS;
};

export type ResetPasswordActions =
  | ResetPasswordRequested
  | ResetPasswordFailure
  | ResetPasswordSuccess;

export const resetPasswordRequested = () => ({
  type: SettingsActionTypes.PASSWORD_RESET_REQUESTED,
});

export const resetPasswordSuccess = (_response?: any) => ({
  type: SettingsActionTypes.PASSWORD_RESET_SUCCESS,
});

export const resetPasswordFailure = (_error?: any) => ({
  type: SettingsActionTypes.PASSWORD_RESET_FAILURE,
});

export default resetPassword(new SettingsService());

export function resetPassword(service: ISettingsService) {
  return (reqData: ResetPasswordRequest) => async (dispatch: Function) => {
    dispatch(resetPasswordRequested());

    try {
      // const { data } = await service.resetPassword(reqData);
      const result = await service.resetPassword(reqData);
      if (result instanceof Success) {
        const { data } = result;
        dispatch(resetPasswordSuccess(data));
      } else {
        dispatch(resetPasswordFailure());
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(resetPasswordFailure(error));
      return error;
    }
  };
}
