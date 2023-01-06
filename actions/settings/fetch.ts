import { handleVersionMismatch } from "actions/versionSync";
import * as SettingsActionTypes from "actiontypes/settings";
import { ActionCreator } from "redux";
import { Either, Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import SettingsService, {
  FetchSettingsResponse,
  ISettingsService,
} from "services/SettingsService";

export type FetchSettingsSuccess = {
  type: typeof SettingsActionTypes.FETCH_SETTINGS_SUCCESS;
  payload: FetchSettingsResponse;
};

export type FetchSettingsRequested = {
  type: typeof SettingsActionTypes.FETCH_SETTINGS_REQUESTED;
};

export type FetchSettingsFailure = {
  type: typeof SettingsActionTypes.FETCH_SETTINGS_FAILURE;
};

export type FetchSettingsActions =
  | FetchSettingsSuccess
  | FetchSettingsRequested
  | FetchSettingsFailure;

export const fetchSettingsRequested = () => ({
  type: SettingsActionTypes.FETCH_SETTINGS_REQUESTED,
  isFetching: true,
});

export const fetchSettingsSuccess: ActionCreator<FetchSettingsSuccess> = (
  response: FetchSettingsResponse
) => ({
  type: SettingsActionTypes.FETCH_SETTINGS_SUCCESS,
  payload: response,
});

export const fetchSettingsFailure = (_error?: any) => ({
  type: SettingsActionTypes.FETCH_SETTINGS_FAILURE,
  // isFetching: false,
  // error: true,
  // status: error.response && error.response.status,
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
