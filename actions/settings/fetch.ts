import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_SETTINGS_FAILURE,
  FETCH_SETTINGS_REQUESTED,
  FETCH_SETTINGS_SUCCESS,
} from "actiontypes/settings";

import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import SettingsService, {
  FetchSettingsResponse,
  ISettingsService,
} from "services/SettingsService";

export type FetchSettingsSuccess = {
  type: typeof FETCH_SETTINGS_SUCCESS;
  payload: FetchSettingsResponse;
};

type FetchSettingsRequested = {
  type: typeof FETCH_SETTINGS_REQUESTED;
};

type FetchSettingsFailure = {
  type: typeof FETCH_SETTINGS_FAILURE;
};

export type FetchSettingsActions =
  FetchSettingsSuccess | FetchSettingsRequested | FetchSettingsFailure;

const fetchSettingsRequested = () => ({
  type: FETCH_SETTINGS_REQUESTED,
  isFetching: true,
});

const fetchSettingsSuccess: ActionCreator<FetchSettingsSuccess> = (
  response: FetchSettingsResponse
) => ({
  type: FETCH_SETTINGS_SUCCESS,
  payload: response,
});

const fetchSettingsFailure = (_error?: any) => ({
  type: FETCH_SETTINGS_FAILURE,
});

/** ----------------------------------------------------------------------------
 * FETCH
 -----------------------------------------------------------------------------*/

export default fetch(new SettingsService());

export function fetch(service: ISettingsService) {
  return () => async (dispatch: Function) => {
    dispatch(fetchSettingsRequested());

    try {
      const result: Either<FetchSettingsResponse> = await service.fetch();

      if (result instanceof Success) {
        const { messageAboutStorylets } = result.data;

        const { messageAboutStories } = result.data as any;

        if (
          messageAboutStorylets === undefined &&
          messageAboutStories !== undefined
        ) {
          console.warn(
            "Settings response contains a `messageAboutStories` field but no `messageAboutStorylets` field; patching"
          );

          result.data.messageAboutStorylets = messageAboutStories;
        }

        const { data } = result;

        dispatch(fetchSettingsSuccess(data));
      } else {
        dispatch(fetchSettingsFailure());
      }

      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));

        return error;
      }

      dispatch(fetchSettingsFailure(error));

      throw error;
    }
  };
}
