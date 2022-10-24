import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_PROFILE_REQUESTED,
  FETCH_PROFILE_FAILURE,
  FETCH_PROFILE_SUCCESS,
} from "actiontypes/profile";
import { ActionCreator } from "redux";
import { Either, Success } from "services/BaseMonadicService";

import ProfileService, { FetchProfileResponse } from "services/ProfileService";
import { VersionMismatch } from "services/BaseService";

export type FetchProfileRequested = { type: typeof FETCH_PROFILE_REQUESTED };
export type FetchProfileFailure = { type: typeof FETCH_PROFILE_FAILURE };
export type FetchProfileSuccess = {
  type: typeof FETCH_PROFILE_SUCCESS;
  payload: FetchProfileResponse;
};

export type FetchProfileActions =
  | FetchProfileRequested
  | FetchProfileFailure
  | FetchProfileSuccess;

const fetchProfileRequest: ActionCreator<FetchProfileRequested> = () => ({
  type: FETCH_PROFILE_REQUESTED,
});
const fetchProfileFailure: ActionCreator<FetchProfileFailure> = () => ({
  type: FETCH_PROFILE_FAILURE,
});

const fetchProfileSuccess: ActionCreator<FetchProfileSuccess> = (
  data: FetchProfileResponse
) => ({
  type: FETCH_PROFILE_SUCCESS,
  payload: data,
});

const profileService = new ProfileService();

/** ----------------------------------------------------------------------------
 * FETCH PROFILE
 -----------------------------------------------------------------------------*/
export default function fetchProfile(
  characterName: string,
  fromEchoId?: number
) {
  return async (dispatch: Function) => {
    dispatch(fetchProfileRequest());
    try {
      const result: Either<FetchProfileResponse> =
        await profileService.fetchProfile(characterName, fromEchoId);
      if (result instanceof Success) {
        dispatch(fetchProfileSuccess(result.data));
      } else {
        dispatch(fetchProfileFailure(result.message));
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
}
