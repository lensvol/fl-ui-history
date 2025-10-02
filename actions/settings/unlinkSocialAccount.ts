import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { handleVersionMismatch } from "actions/versionSync";

import * as SettingsActionTypes from "actiontypes/settings";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import SettingsService, { ISettingsService } from "services/SettingsService";

const service: ISettingsService = new SettingsService();

export type UnlinkSocialAccountRequested = {
  type: typeof SettingsActionTypes.UNLINK_SOCIAL_ACCOUNT_REQUESTED;
};

export type UnlinkSocialAccountFailure = {
  type: typeof SettingsActionTypes.UNLINK_SOCIAL_ACCOUNT_FAILURE;
};

export type UnlinkSocialAccountSuccess = {
  type: typeof SettingsActionTypes.UNLINK_SOCIAL_ACCOUNT_SUCCESS;
  payload: {
    accountType: "apple" | "facebook" | "google";
  };
};

export type UnlinkSocialAccountActions =
  | UnlinkSocialAccountRequested
  | UnlinkSocialAccountFailure
  | UnlinkSocialAccountSuccess;

export const unlinkSocialAccountRequested = () => ({
  type: SettingsActionTypes.UNLINK_SOCIAL_ACCOUNT_REQUESTED,
  isUnlinking: true,
});

export const unlinkSocialAccountSuccess: ActionCreator<
  UnlinkSocialAccountSuccess
> = (_response: any, account: "apple" | "facebook" | "google") => ({
  type: SettingsActionTypes.UNLINK_SOCIAL_ACCOUNT_SUCCESS,
  payload: {
    accountType: account,
  },
});

export const unlinkSocialAccountFailure = (
  error: any,
  _account: "apple" | "facebook" | "google"
) => ({
  type: SettingsActionTypes.UNLINK_SOCIAL_ACCOUNT_FAILURE,
  isUnlinking: false,
  error: true,
  status: error.response && error.response.status,
});

export default function unlinkSocialAccount(
  account: "apple" | "facebook" | "google"
) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(unlinkSocialAccountRequested());

    const endpointMethod = (() => {
      switch (account) {
        case "apple":
          return service.unlinkApple;

        case "facebook":
          return service.unlinkFacebook;

        case "google":
          return service.unlinkGoogle;

        default:
          return undefined;
      }
    })();

    if (!endpointMethod) {
      throw new Error(`Unrecognised social auth type "${account}"`);
    }

    try {
      const result = await endpointMethod();

      if (result instanceof Success) {
        dispatch(unlinkSocialAccountSuccess(result.data, account));
      } else {
        dispatch(unlinkSocialAccountFailure(result, account));
      }

      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));

        return error;
      }

      throw error;
    }
  };
}
