import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ThunkApiConfig } from "features/app/store";
import { Success } from "services/BaseMonadicService";
import { AreaWithNestedJsonInfo } from "types/map";
import { IQuality } from "types/qualities";
import ProfileService, {
  ApiSharedContent,
  FetchProfileResponse,
  FetchSharedContentRequest,
  FetchSharedContentResponse,
  IProfileCharacter,
  ShareContentRequest,
  UpdateDescriptionResponse as BaseUpdateDescriptionResponse,
  ShareResponse,
} from "services/ProfileService";

export interface IProfileState {
  characterName: string | undefined;
  currentArea: AreaWithNestedJsonInfo | undefined;
  description: string | undefined;
  expandedEquipped: { name: string; possessions: IQuality[] } | undefined;
  isFetching: boolean;
  isLoggedInUsersProfile: boolean;
  isSharing: boolean;
  profileCharacter?: IProfileCharacter | undefined;
  mantelpieceItem: IQuality | undefined;
  next?: string | null;
  prev?: string | null;
  scrapbookStatus: IQuality | undefined;
  sharedContent: ApiSharedContent[];
  shareMessageResponse: string | null;
  standardEquipped: { name: string; possessions: IQuality[] } | undefined;
  profileName?: string;
  profileDescription?: string;
  profileBanner?: string;
  outfitName?: string;
}

const initialState: IProfileState = {
  characterName: undefined,
  isFetching: false,
  isLoggedInUsersProfile: false,
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
  profileName: undefined,
  profileDescription: undefined,
  profileBanner: undefined,
  outfitName: undefined,
};

export type DeleteEntryArg = { entryId: number };
export type FetchProfileArg = {
  characterName: string;
  fromEchoId?: string | number;
};
export type FetchSharedContentArg = FetchSharedContentRequest;
export type ShareContentArg = ShareContentRequest;
export type ToggleFavouriteJournalEntryArg = { id: number };
export type UpdateDescriptionArg = { description: string };
export type UpdateDescriptionResponse = BaseUpdateDescriptionResponse &
  UpdateDescriptionArg;

const deleteEntry = createAsyncThunk<
  DeleteEntryArg,
  DeleteEntryArg,
  ThunkApiConfig
>("profile/deleteEntry", async ({ entryId }) => {
  const response = await new ProfileService().deleteEntry(entryId);
  if (response instanceof Success) {
    return { entryId };
  }

  throw response;
});

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

const fetchSharedContent = createAsyncThunk<
  FetchSharedContentResponse,
  FetchSharedContentArg,
  ThunkApiConfig
>("profile/fetchSharedContent", async (arg) => {
  const response = await new ProfileService().fetchSharedContent(arg);
  if (response instanceof Success) {
    return response.data;
  }

  throw response;
});

const fetchSharedContentByUrl = createAsyncThunk<
  FetchSharedContentResponse,
  { url: string },
  ThunkApiConfig
>("profile/fetchSharedContentByUrl", async ({ url }) => {
  const response = await new ProfileService().fetchSharedContentByUrl(url);
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

const toggleFavouriteJournalEntry = createAsyncThunk<
  ShareResponse,
  ToggleFavouriteJournalEntryArg,
  ThunkApiConfig
>("profile/toggleFavourite", async ({ id }) => {
  const response = await new ProfileService().toggleFavouriteJournalEntry(id);

  if (response instanceof Success) {
    return {
      ...response.data,
      id,
    };
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
    return { ...response.data, description };
  }

  throw response;
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteEntry.pending, (s) => {
      s.isFetching = true;
    });
    builder.addCase(deleteEntry.rejected, (s) => {
      s.isFetching = false;
    });
    builder.addCase(deleteEntry.fulfilled, onDeleteEntryFulfilled);

    builder.addCase(fetchProfile.pending, (s) => {
      s.isFetching = true;
    });
    builder.addCase(fetchProfile.rejected, (s) => {
      s.isFetching = false;
    });

    builder.addCase(fetchProfile.fulfilled, onFetchProfileFulfilled);
    builder.addCase(
      fetchSharedContent.fulfilled,
      onFetchSharedContentFulfilled
    );
    builder.addCase(
      fetchSharedContentByUrl.fulfilled,
      onFetchSharedContentFulfilled
    );

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
export {
  deleteEntry,
  fetchProfile,
  fetchSharedContent,
  fetchSharedContentByUrl,
  shareContent,
  toggleFavouriteJournalEntry,
  updateDescription,
};

function onDeleteEntryFulfilled(
  state: IProfileState,
  action: { payload: { entryId: number } }
) {
  state.isFetching = false;
  state.sharedContent = state.sharedContent.filter(
    (s) => s.id !== action.payload.entryId
  );
}

function onFetchProfileFulfilled(
  state: IProfileState,
  action: { payload: FetchProfileResponse }
) {
  const {
    characterName,
    currentArea,
    expandedEquippedPossessions,
    isLoggedInUsersProfile,
    profileCharacter,
    standardEquippedPossessions,
    profileName,
    profileDescription,
    profileBanner,
    outfitName,
  } = action.payload;
  state.isFetching = false;

  state.characterName = characterName;
  state.currentArea = currentArea;
  state.expandedEquipped = expandedEquippedPossessions;
  state.isLoggedInUsersProfile = isLoggedInUsersProfile;
  state.profileCharacter = profileCharacter;
  state.standardEquipped = standardEquippedPossessions;
  state.profileName = profileName;
  state.profileDescription = profileDescription;
  state.profileBanner = profileBanner;
  state.outfitName = outfitName;
}

function onFetchSharedContentFulfilled(
  state: IProfileState,
  action: { payload: FetchSharedContentResponse }
) {
  const { next, prev, shares } = action.payload;
  state.next = next;
  state.prev = prev;
  state.sharedContent = shares;
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
