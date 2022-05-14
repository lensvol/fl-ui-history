import { ActionCreator } from 'redux';

import { DeleteEntryActions } from 'actions/profile/deleteEntry';
import { FetchProfileActions } from 'actions/profile/fetchProfile';
import { FetchSharedContentActions } from 'actions/profile/fetchSharedContent';
import {
  ShareContentActions,
  shareContentComplete,
} from 'actions/profile/shareContent';
import { UPDATE_DESCRIPTION_SUCCESS } from 'actiontypes/profile';
import * as ProfileActionTypes from 'actiontypes/profile';
import ProfileService from 'services/ProfileService';

export { default as fetchProfile } from 'actions/profile/fetchProfile';
export { default as fetchSharedContent } from 'actions/profile/fetchSharedContent';
export { default as fetchSharedContentByUrl } from 'actions/profile/fetchSharedContentByUrl';
export { default as shareContent } from 'actions/profile/shareContent';
export { default as deleteEntry } from 'actions/profile/deleteEntry';

export type UpdateDescriptionSuccess = { type: typeof UPDATE_DESCRIPTION_SUCCESS, payload: string };

export type ProfileActions
  = DeleteEntryActions
  | FetchProfileActions
  | FetchSharedContentActions
  | ShareContentActions
  | UpdateDescriptionSuccess;

export {
  shareContentComplete,
};

const profileService = new ProfileService();

const updateDescriptionRequest = () => ({
  type: ProfileActionTypes.UPDATE_DESCRIPTION_REQUESTED,
  isFetching: true,
});

const updateDescriptionSuccess: ActionCreator<UpdateDescriptionSuccess> = (newDescription) => ({
  type: ProfileActionTypes.UPDATE_DESCRIPTION_SUCCESS,
  isFetching: false,
  payload: newDescription,
});

const updateDescriptionFailure = (_error?: any) => ({
  type: ProfileActionTypes.UPDATE_DESCRIPTION_FAILURE,
  isFetching: false,
});


/** ----------------------------------------------------------------------------
 *  UPDATE DESC
 -----------------------------------------------------------------------------*/
export const updateDescription = (newDescription: string) => async (dispatch: Function) => {
  dispatch(updateDescriptionRequest());
  try {
    await profileService.updateDescription(newDescription);
    dispatch(updateDescriptionSuccess(newDescription));
  } catch (message) {
    dispatch(updateDescriptionFailure(message));
  }
};


/** ----------------------------------------------------------------------------
 *  SHARE CONTENT
 -----------------------------------------------------------------------------*/
