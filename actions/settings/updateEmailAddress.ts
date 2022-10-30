import { handleVersionMismatch } from "actions/versionSync";
import * as SettingsActionTypes from "actiontypes/settings";
import { ActionCreator } from "redux";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import SettingsService, { ISettingsService } from "services/SettingsService";

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
  (emailAddress: string) => async (dispatch: Function) => {
    dispatch(updateEmailAddressRequested());

    const service: ISettingsService = new SettingsService();

    const result = await service.updateEmailAddress(emailAddress);
    try {
      if (result instanceof Success) {
        dispatch(updateEmailAddressSuccess(emailAddress));
      } else {
        dispatch(updateEmailAddressFailure(result));
      }
      return result;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
        return e;
      }
      dispatch(updateEmailAddressFailure());
      throw e;
    }
  };

export default updateEmailAddress;
