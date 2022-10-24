import { handleVersionMismatch } from "actions/versionSync";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import ProfileService, {
  FetchSharedContentArgs,
  FetchSharedContentResponse,
  IProfileService,
} from "services/ProfileService";
import {
  FETCH_SHARED_CONTENT_REQUESTED,
  FETCH_SHARED_CONTENT_SUCCESS,
} from "actiontypes/profile";

export type FetchSharedContentRequested = {
  type: typeof FETCH_SHARED_CONTENT_REQUESTED;
};

export type FetchSharedContentSuccess = {
  type: typeof FETCH_SHARED_CONTENT_SUCCESS;
  payload: FetchSharedContentResponse;
};

export type FetchSharedContentActions =
  | FetchSharedContentRequested
  | FetchSharedContentSuccess;

export const fetchSharedContentRequested: ActionCreator<
  FetchSharedContentRequested
> = () => ({
  type: FETCH_SHARED_CONTENT_REQUESTED,
});

export const fetchSharedContentSuccess: ActionCreator<
  FetchSharedContentSuccess
> = (data) => ({
  type: FETCH_SHARED_CONTENT_SUCCESS,
  payload: data,
});

export default fetchSharedContent(new ProfileService());

export function fetchSharedContent(service: IProfileService) {
  return ({
      characterName,
      count,
      date,
      fromId,
      offset,
    }: FetchSharedContentArgs) =>
    async (dispatch: ThunkDispatch<any, any, any>) => {
      dispatch(fetchSharedContentRequested());
      try {
        const result = await service.fetchSharedContent({
          characterName,
          count,
          date,
          fromId,
          offset,
        });

        if (result instanceof Success) {
          const { data } = result;
          dispatch(fetchSharedContentSuccess(data));
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
