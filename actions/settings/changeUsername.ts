import { handleVersionMismatch } from "actions/versionSync";
import {
  CHANGE_USERNAME_FAILURE,
  CHANGE_USERNAME_REQUESTED,
  CHANGE_USERNAME_SUCCESS,
} from "actiontypes/settings";
import * as SettingsActionTypes from "actiontypes/settings";
import { ActionCreator, AnyAction } from "redux";
import { Success, Either } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import SettingsService, {
  ChangeUsernameResponse,
  ISettingsService,
} from "services/SettingsService";
import { ThunkDispatch } from "@reduxjs/toolkit";

export type ChangeUsernameRequested = {
  type: typeof CHANGE_USERNAME_REQUESTED;
};
export type ChangeUsernameFailure = { type: typeof CHANGE_USERNAME_FAILURE };
export type ChangeUsernameSuccess = {
  type: typeof CHANGE_USERNAME_SUCCESS;
  payload: { username: string };
};

export type ChangeUsernameActions =
  | ChangeUsernameRequested
  | ChangeUsernameFailure
  | ChangeUsernameSuccess;

export const changeUsernameRequested: ActionCreator<
  ChangeUsernameRequested
> = () => ({
  type: SettingsActionTypes.CHANGE_USERNAME_REQUESTED,
});

export const changeUsernameSuccess: ActionCreator<ChangeUsernameSuccess> = (
  username: string
) => ({
  type: SettingsActionTypes.CHANGE_USERNAME_SUCCESS,
  payload: { username },
});

export const changeUsernameFailure: ActionCreator<ChangeUsernameFailure> = (
  _error?: any
) => ({
  type: SettingsActionTypes.CHANGE_USERNAME_FAILURE,
});

export default changeUsername(new SettingsService());

export function changeUsername(service: ISettingsService) {
  return (username: string) =>
    async (
      dispatch: ThunkDispatch<
        Either<ChangeUsernameResponse>,
        unknown,
        AnyAction
      >
    ) => {
      dispatch(changeUsernameRequested());

      try {
        const result = await service.changeUsername(username);
        if (result instanceof Success) {
          dispatch(changeUsernameSuccess(username));
        } else {
          dispatch(changeUsernameFailure());
        }
        return result;
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));
          return error;
        }
        dispatch(changeUsernameFailure(error));
        return error;
      }
    };
}
