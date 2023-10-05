import { ProfileActions } from "actions/profile";
import * as ProfileActionTypes from "actiontypes/profile";

import deleteEntrySuccess from "reducers/profile/deleteEntrySuccess";
import fetchProfileSuccess from "reducers/profile/fetchProfileSuccess";
import fetchSharedContentSuccess from "reducers/profile/fetchSharedContentSuccess";
import { IProfileState } from "features/profile";

const INITIAL_STATE: IProfileState = {
  characterName: undefined,
  isFetching: false,
  isLoggedInUsersProfile: false,
  lookingAtOwnProfile: false,
  description: undefined,
  currentArea: undefined,
  profileCharacter: undefined,
  standardEquipped: undefined,
  expandedEquipped: undefined,
  mantelpieceItem: undefined,
  scrapbookStatus: undefined,
  sharedContent: [],
  isSharing: false,
  shareMessageResponse: null,
  next: null,
  prev: null,
};

/**
 * Character Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
export default function reducer(state = INITIAL_STATE, action: ProfileActions) {
  switch (action.type) {
    case ProfileActionTypes.FETCH_PROFILE_REQUESTED:
      return { ...state, isFetching: true };

    case ProfileActionTypes.FETCH_PROFILE_FAILURE:
      return { ...state, isFetching: false };

    case ProfileActionTypes.FETCH_PROFILE_SUCCESS:
      return fetchProfileSuccess(state, action);

    case ProfileActionTypes.FETCH_SHARED_CONTENT_SUCCESS:
      return fetchSharedContentSuccess(state, action);

    case ProfileActionTypes.UPDATE_DESCRIPTION_SUCCESS:
      return {
        ...state,
        profileCharacter: {
          ...state.profileCharacter,
          description: action.payload,
        },
      };

    case ProfileActionTypes.SHARE_CONTENT_REQUESTED:
      return { ...state, isSharing: true };

    case ProfileActionTypes.SHARE_CONTENT_FAILURE:
      return { ...state, isSharing: false };

    case ProfileActionTypes.SHARE_CONTENT_SUCCESS:
      return {
        ...state,
        isSharing: false,
        shareMessageResponse: action.payload,
      };

    case ProfileActionTypes.SHARE_CONTENT_COMPLETE:
      return {
        ...state,
        shareMessageResponse: null,
      };

    case ProfileActionTypes.DELETE_ENTRY_SUCCESS:
      return deleteEntrySuccess(state, action);

    case ProfileActionTypes.DELETE_ENTRY_FAILURE:
      return { ...state, isFetching: false };

    case ProfileActionTypes.DELETE_ENTRY_REQUESTED:
      return { ...state, isFetching: true };

    default:
      return state;
  }
}
