import { handleVersionMismatch } from 'actions/versionSync';
import * as SettingsActionTypes from 'actiontypes/settings';
import { ActionCreator } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import SettingsService, {
  LinkEmailRequest,
  LinkEmailResponse,
} from 'services/SettingsService';

const service = new SettingsService();

export type LinkEmailToAccountRequested = {
  type: typeof SettingsActionTypes.LINK_EMAIL_TO_ACCOUNT_REQUESTED,
}

export type LinkEmailToAccountFailure = {
  type: typeof SettingsActionTypes.LINK_EMAIL_TO_ACCOUNT_FAILURE,
};

export type LinkEmailToAccountSuccess = {
  type: typeof SettingsActionTypes.LINK_EMAIL_TO_ACCOUNT_SUCCESS,
};

export type LinkEmailToAcountActions =
  LinkEmailToAccountRequested
  | LinkEmailToAccountFailure
  | LinkEmailToAccountSuccess;

export const linkEmailToAccountRequested = () => ({
  type: SettingsActionTypes.LINK_EMAIL_TO_ACCOUNT_REQUESTED,
});

export const linkEmailToAccountSuccess: ActionCreator<LinkEmailToAccountSuccess> = (_response: LinkEmailResponse) => ({
  type: SettingsActionTypes.LINK_EMAIL_TO_ACCOUNT_SUCCESS,
});

export const linkEmailToAccountFailure = (_error?: any) => ({
  type: SettingsActionTypes.LINK_EMAIL_TO_ACCOUNT_FAILURE,
});

export default function linkEmailToAccount(data: LinkEmailRequest) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(linkEmailToAccountRequested());

    try {
      const response = await service.linkEmailToAccount(data);

      if (response instanceof Success) {
        dispatch(linkEmailToAccountSuccess(response.data));
      } else {
        dispatch(linkEmailToAccountFailure(response));
      }

      return response;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(linkEmailToAccountFailure(error));
      throw error;
    }
  };
}
