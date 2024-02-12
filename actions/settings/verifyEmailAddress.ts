import { handleVersionMismatch } from "actions/versionSync";
import * as SettingsActionTypes from "actiontypes/settings";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import SettingsService, {
  ISettingsService,
  VerifyEmailResponse,
} from "services/SettingsService";

export type VerifyEmailAddressFailure = {
  type: typeof SettingsActionTypes.VERIFY_EMAIL_FAILURE;
};
export type VerifyEmailAddressRequested = {
  type: typeof SettingsActionTypes.VERIFY_EMAIL_REQUESTED;
};
export type VerifyEmailAddressSuccess = {
  type: typeof SettingsActionTypes.VERIFY_EMAIL_SUCCESS;
};

export type VerifyEmailAddressActions =
  | VerifyEmailAddressRequested
  | VerifyEmailAddressSuccess
  | VerifyEmailAddressFailure;

export const verifyEmailAddressRequested = () => ({
  type: SettingsActionTypes.VERIFY_EMAIL_REQUESTED,
  isVerifyingEmail: true,
});

export const verifyEmailAddressSuccess: ActionCreator<
  VerifyEmailAddressSuccess
> = () => ({
  type: SettingsActionTypes.VERIFY_EMAIL_SUCCESS,
});

export const verifyEmailAddressFailure: ActionCreator<
  VerifyEmailAddressFailure
> = () => ({
  type: SettingsActionTypes.VERIFY_EMAIL_FAILURE,
});

export const requestVerifyEmail =
  () => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(verifyEmailAddressRequested());

    const service: ISettingsService = new SettingsService();
    const result: Either<VerifyEmailResponse> =
      await service.requestVerifyEmail();

    try {
      if (result instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(result));

        return result;
      }

      if (result instanceof Success) {
        dispatch(verifyEmailAddressSuccess(result));
      } else {
        dispatch(verifyEmailAddressFailure(result));
      }

      return result;
    } catch (e) {
      dispatch(verifyEmailAddressFailure());

      throw e;
    }
  };

export default requestVerifyEmail;
