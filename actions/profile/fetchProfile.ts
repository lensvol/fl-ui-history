import { ActionCreator } from "@reduxjs/toolkit";

import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_PROFILE_FAILURE,
  FETCH_PROFILE_REQUESTED,
  FETCH_PROFILE_SUCCESS,
} from "actiontypes/profile";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import ProfileService, {
  FetchProfileResponse,
  IProfileService,
} from "services/ProfileService";

type FetchProfileArg = {
  characterName: string;
};

type FetchProfileRequested = {
  type: typeof FETCH_PROFILE_REQUESTED;
};

type FetchProfileFailure = {
  type: typeof FETCH_PROFILE_FAILURE;
};

type FetchProfileSuccess = {
  type: typeof FETCH_PROFILE_SUCCESS;
  payload: FetchProfileResponse;
};

export type FetchProfileActions =
  FetchProfileRequested | FetchProfileFailure | FetchProfileSuccess;

export default fetchProfile(new ProfileService());

function fetchProfile(service: IProfileService) {
  return ({ characterName }: FetchProfileArg) =>
    async (dispatch: Function) => {
      dispatch(fetchProfileRequest());

      try {
        const response = await service.fetchProfile(characterName);

        if (response instanceof Success) {
          dispatch(fetchProfileSuccess(response.data));

          return response.data;
        }

        throw response;
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));

          return error;
        }

        dispatch(fetchProfileFailure());

        throw error;
      }
    };
}

const fetchProfileRequest: ActionCreator<FetchProfileRequested> = () => ({
  type: FETCH_PROFILE_REQUESTED,
});

const fetchProfileSuccess: ActionCreator<FetchProfileSuccess> = (
  response: FetchProfileResponse
) => ({
  type: FETCH_PROFILE_SUCCESS,
  payload: response,
});

const fetchProfileFailure: ActionCreator<FetchProfileFailure> = () => ({
  type: FETCH_PROFILE_FAILURE,
});
