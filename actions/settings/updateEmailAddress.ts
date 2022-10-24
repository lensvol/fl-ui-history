import { handleVersionMismatch } from "actions/versionSync";
import * as SettingsActionTypes from "actiontypes/settings";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import SettingsService, {
  ISettingsService,
  UpdateEmailResponse,
} from "services/SettingsService";

export type UpdateEmailAddressFailure = {
  type: typeof SettingsActionTypes.UPDATE_EMAIL_FAILURE;
};
export type UpdateEmailAddressRequested = {
  type: typeof SettingsActionTypes.UPDATE_EMAIL_REQUESTED;
};
export type UpdateEmailAddressSuccess = {
  type: typeof SettingsActionTypes.UPDATE_EMAIL_SUCCESS;
  payload: { emailAddress: string };
};

export type UpdateEmailAddressActions =
  | UpdateEmailAddressRequested
  | UpdateEmailAddressSuccess
  | UpdateEmailAddressFailure;

export const updateEmailAddressRequested = () => ({
  type: SettingsActionTypes.UPDATE_EMAIL_REQUESTED,
  isUpdatingEmail: true,
});

export const updateEmailAddressSuccess: ActionCreator<
  UpdateEmailAddressSuccess
> = (emailAddress: string) => ({
  type: SettingsActionTypes.UPDATE_EMAIL_SUCCESS,
  payload: { emailAddress },
});

export const updateEmailAddressFailure: ActionCreator<
  UpdateEmailAddressFailure
> = () => ({
  type: SettingsActionTypes.UPDATE_EMAIL_FAILURE,
});

export const updateEmailAddress =
  (emailAddress: string) => async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(updateEmailAddressRequested());

    const service: ISettingsService = new SettingsService();

    const result: Either<UpdateEmailResponse> =
      await service.updateEmailAddress(emailAddress);
    try {
      if (result instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(result));
        return result;
      }
      if (result instanceof Success) {
        dispatch(updateEmailAddressSuccess(emailAddress));
      } else {
        dispatch(updateEmailAddressFailure(result));
      }
      return result;
    } catch (e) {
      dispatch(updateEmailAddressFailure());
      throw e;
    }
  };

export default updateEmailAddress;
