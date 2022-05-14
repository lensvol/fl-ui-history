import { handleVersionMismatch } from 'actions/versionSync';
import * as SettingsActionTypes from 'actiontypes/settings';
import { ActionCreator } from 'redux';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import SettingsService, { ISettingsService } from 'services/SettingsService';

export type DeactivateAccountRequested = { type: typeof SettingsActionTypes.DEACTIVATE_ACCOUNT_REQUESTED };
export type DeactivateAccountSuccess = { type: typeof SettingsActionTypes.DEACTIVATE_ACCOUNT_SUCCESS };
export type DeactivateAccountFailure = { type: typeof SettingsActionTypes.DEACTIVATE_ACCOUNT_FAILURE };

export type DeactivateAccountActions = DeactivateAccountSuccess | DeactivateAccountFailure | DeactivateAccountRequested;

export const deactivateAccountRequested: ActionCreator<DeactivateAccountRequested> = () => ({
  type: SettingsActionTypes.DEACTIVATE_ACCOUNT_REQUESTED,
});

export const deactivateAccountSuccess: ActionCreator<DeactivateAccountSuccess> = (_response?: any) => ({
  type: SettingsActionTypes.DEACTIVATE_ACCOUNT_SUCCESS,
});

export const deactivateAccountFailure: ActionCreator<DeactivateAccountFailure> = (_error?: any) => ({
  type: SettingsActionTypes.DEACTIVATE_ACCOUNT_FAILURE,
});

export default deactivateAccount(new SettingsService());

export function deactivateAccount(service: ISettingsService) {
  return () => async (dispatch: Function) => {
    dispatch(deactivateAccountRequested());

    try {
      const result =  await service.deactivateAccount();
      if (result instanceof Success) {
        dispatch(deactivateAccountSuccess(result.data));
      } else {
        dispatch(deactivateAccountFailure());
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(deactivateAccountFailure(error));
      return error;
    }
  };
}