import { FetchProfileActions } from "actions/profile/fetchProfile";
import { ShareContentActions } from "actions/profile/shareContent";
import { UpdateDescriptionActions } from "actions/profile/updateDescription";

import {
  FETCH_PROFILE_FAILURE,
  FETCH_PROFILE_REQUESTED,
  FETCH_PROFILE_SUCCESS,
  SHARE_CONTENT_FAILURE,
  SHARE_CONTENT_REQUESTED,
  SHARE_CONTENT_SUCCESS,
  UPDATE_DESCRIPTION_FAILURE,
  UPDATE_DESCRIPTION_REQUESTED,
  UPDATE_DESCRIPTION_SUCCESS,
} from "actiontypes/profile";

import { ApiSharedContent, IProfileCharacter } from "services/ProfileService";

import { AreaWithNestedJsonInfo } from "types/map";
import { IQuality } from "types/qualities";

export interface IProfileState {
  characterName?: string;
  currentArea?: AreaWithNestedJsonInfo;
  description?: string;
  hasFavouredOutfit?: boolean;
  isFetching: boolean;
  isLoggedInUsersProfile: boolean;
  isSharing: boolean;
  mantelpieceItem?: IQuality;
  outfitName?: string;
  profileBanner?: string;
  profileCharacter?: IProfileCharacter;
  profileDescription?: string;
  profileName?: string;
  scrapbookStatus?: IQuality;
  sharedContent: ApiSharedContent[];
  shareMessageResponse: string | null;
  standardEquipped?: {
    possessions: IQuality[];
  };
}

const INITIAL_STATE: IProfileState = {
  characterName: undefined,
  currentArea: undefined,
  description: undefined,
  hasFavouredOutfit: undefined,
  isFetching: false,
  isLoggedInUsersProfile: false,
  isSharing: false,
  mantelpieceItem: undefined,
  outfitName: undefined,
  profileBanner: undefined,
  profileCharacter: undefined,
  profileDescription: undefined,
  profileName: undefined,
  scrapbookStatus: undefined,
  sharedContent: [],
  shareMessageResponse: null,
  standardEquipped: undefined,
};

type ProfileActions =
  FetchProfileActions | ShareContentActions | UpdateDescriptionActions;

export default function reducer(state = INITIAL_STATE, action: ProfileActions) {
  switch (action.type) {
    case FETCH_PROFILE_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };

    case FETCH_PROFILE_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        characterName: action.payload.characterName,
        currentArea: action.payload.currentArea,
        hasFavouredOutfit: action.payload.hasFavouredOutfit,
        isLoggedInUsersProfile: action.payload.isLoggedInUsersProfile,
        outfitName: action.payload.outfitName,
        profileBanner: action.payload.profileBanner,
        profileCharacter: action.payload.profileCharacter,
        profileDescription: action.payload.profileDescription,
        profileName: action.payload.profileName,
        standardEquipped: action.payload.standardEquippedPossessions,
      };

    case SHARE_CONTENT_REQUESTED:
      return {
        ...state,
        isSharing: true,
      };

    case SHARE_CONTENT_FAILURE:
    case SHARE_CONTENT_SUCCESS:
      return {
        ...state,
        isSharing: false,
      };

    case UPDATE_DESCRIPTION_SUCCESS: {
      if (!state.profileCharacter) {
        console.error(
          "Tried to update profile description for an undefined user"
        );

        return state;
      }

      return {
        ...state,
        profileCharacter: {
          ...state.profileCharacter,
          description: action.payload.description,
        },
      };
    }

    case UPDATE_DESCRIPTION_FAILURE:
    case UPDATE_DESCRIPTION_REQUESTED:
    default:
      return state;
  }
}
