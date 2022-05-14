import { handleVersionMismatch } from 'actions/versionSync';
import * as SettingsActionTypes from 'actiontypes/settings';
import { ThunkDispatch } from 'redux-thunk';
import {
  Either,
  Success,
} from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import SettingsService, {
  FacebookPayload,
  ISettingsService,
  LinkTwitterRequest,
} from 'services/SettingsService';

export type LinkSocialAccountSuccess = {
  type: typeof SettingsActionTypes.LINK_SOCIAL_ACCOUNT_SUCCESS,
  payload: { accountType: string },
};

export type LinkSocialAccountActions = LinkSocialAccountSuccess;

export const linkSocialAccountSuccess = (accountType: string) => ({
  type: SettingsActionTypes.LINK_SOCIAL_ACCOUNT_SUCCESS,
  payload: {
    accountType,
  },
});

export const linkSocialAccountRequested = () => ({
  type: SettingsActionTypes.LINK_SOCIAL_ACCOUNT_REQUESTED,
  isLinking: true,
});

export const linkSocialAccountFailure = (_error?: any) => ({
  type: SettingsActionTypes.LINK_SOCIAL_ACCOUNT_FAILURE,
});

export const linkFacebook = (data: FacebookPayload) => async (dispatch: ThunkDispatch<any, any, any>) => {
  dispatch(linkSocialAccountRequested());

  const service: ISettingsService = new SettingsService();

  try {
    const result = await service.linkFacebook(data);
    if (result instanceof Success) {
      dispatch(linkSocialAccountSuccess('facebook'));
    } else {
      dispatch(linkSocialAccountFailure());
    }
    return result;
  } catch (error) {
    if (error instanceof VersionMismatch) {
      dispatch(handleVersionMismatch(error));
      return error;
    }
    dispatch(linkSocialAccountFailure());
    throw error;
  }
};

export const linkGoogle = (data: { token: string }) => async (dispatch: ThunkDispatch<any, any, any>) => {
  const service: ISettingsService = new SettingsService();
  try {
    const result = await service.linkGoogle(data);
    if (result instanceof Success) {
      dispatch(linkSocialAccountSuccess('google'));
    } else {
      dispatch(linkSocialAccountFailure());
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

export const linkTwitter = (req: LinkTwitterRequest) => async (
  dispatch: ThunkDispatch<Either<{/* empty response */ }>, any, any>,
) => {
  dispatch(linkSocialAccountRequested());
  const service: ISettingsService = new SettingsService();
  const result = await service.linkTwitter(req);
  if (result instanceof Success) {
    dispatch(linkSocialAccountSuccess('twitter'));
  } else {
    dispatch(linkSocialAccountFailure());
  }
  return result;
};
