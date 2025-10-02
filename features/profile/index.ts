import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ThunkApiConfig } from "features/app/store";

import { Success } from "services/BaseMonadicService";
import ProfileService, {
  ApiSharedContent,
  FetchProfileResponse,
  IProfileCharacter,
  ShareContentRequest,
  ShareResponse,
  UpdateDescriptionResponse as BaseUpdateDescriptionResponse,
} from "services/ProfileService";

import { AreaWithNestedJsonInfo } from "types/map";
import { IQuality } from "types/qualities";

export interface IProfileState {
  characterName: string | undefined;
  currentArea: AreaWithNestedJsonInfo | undefined;
  description: string | undefined;
  hasFavouredOutfit?: boolean;
  isFetching: boolean;
  isLoggedInUsersProfile: boolean;
  isSharing: boolean;
  mantelpieceItem: IQuality | undefined;
  outfitName?: string;
  profileBanner?: string;
  profileCharacter?: IProfileCharacter | undefined;
  profileDescription?: string;
  profileName?: string;
  scrapbookStatus: IQuality | undefined;
  sharedContent: ApiSharedContent[];
  shareMessageResponse: string | null;
  standardEquipped:
    | {
        possessions: IQuality[];
      }
    | undefined;
}

const initialState: IProfileState = {
  characterName: undefined,
  currentArea: undefined,
  description: undefined,
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

export type FetchProfileArg = {
  characterName: string;
  fromEchoId?: string | number;
};

export type ShareContentArg = ShareContentRequest;

export type ToggleFavouriteJournalEntryArg = {
  id: number;
};

export type UpdateDescriptionArg = {
  description: string;
};

export type UpdateDescriptionResponse = BaseUpdateDescriptionResponse &
  UpdateDescriptionArg;

const fetchProfile = createAsyncThunk<
  FetchProfileResponse,
  FetchProfileArg,
  ThunkApiConfig
>("profile/fetchProfile", async ({ characterName, fromEchoId }) => {
  const response = await new ProfileService().fetchProfile(
    characterName,
    fromEchoId
  );

  if (response instanceof Success) {
    return response.data;
  }

  throw response;
});

const shareContent = createAsyncThunk<
  ShareResponse,
  ShareContentArg,
  ThunkApiConfig
>("profile/shareContent", async (arg) => {
  const response = await new ProfileService().share(arg);

  if (response instanceof Success) {
    return response.data;
  }

  throw response;
});

const updateDescription = createAsyncThunk<
  UpdateDescriptionResponse,
  UpdateDescriptionArg,
  ThunkApiConfig
>("profile/updateDescription", async ({ description }) => {
  const response = await new ProfileService().updateDescription(description);

  if (response instanceof Success) {
    return {
      ...response.data,
      description,
    };
  }

  throw response;
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (s) => {
      s.isFetching = true;
    });
    builder.addCase(fetchProfile.rejected, (s) => {
      s.isFetching = false;
    });
    builder.addCase(fetchProfile.fulfilled, onFetchProfileFulfilled);

    builder.addCase(shareContent.pending, (s) => {
      s.isSharing = true;
    });
    builder.addCase(shareContent.rejected, (s) => {
      s.isSharing = false;
    });
    builder.addCase(shareContent.fulfilled, onShareContentFulfilled);

    builder.addCase(updateDescription.fulfilled, onUpdateDescriptionFulfilled);
  },
});

export type { IProfileCharacter } from "services/ProfileService";

export const { reducer } = profileSlice;

export { fetchProfile, shareContent, updateDescription };

function onFetchProfileFulfilled(
  state: IProfileState,
  action: { payload: FetchProfileResponse }
) {
  const {
    characterName,
    currentArea,
    hasFavouredOutfit,
    isLoggedInUsersProfile,
    outfitName,
    profileBanner,
    profileCharacter,
    profileDescription,
    profileName,
    standardEquippedPossessions,
  } = action.payload;

  state.isFetching = false;
  state.characterName = characterName;
  state.currentArea = currentArea;
  state.hasFavouredOutfit = hasFavouredOutfit;
  state.isLoggedInUsersProfile = isLoggedInUsersProfile;
  state.outfitName = outfitName;
  state.profileBanner = profileBanner;
  state.profileCharacter = profileCharacter;
  state.profileDescription = profileDescription;
  state.profileName = profileName;
  state.standardEquipped = standardEquippedPossessions;
}

function onShareContentFulfilled(state: IProfileState) {
  state.isSharing = false;
}

function onUpdateDescriptionFulfilled(
  state: IProfileState,
  action: { payload: UpdateDescriptionResponse }
) {
  if (!state.profileCharacter) {
    console.error("Tried to update profile description for an undefined user");

    return;
  }

  state.profileCharacter.description = action.payload.description;
}
