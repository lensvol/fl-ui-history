import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_JOURNAL_FAVORITE_REQUESTED,
  FETCH_JOURNAL_FAVORITE_SUCCESS,
} from "actiontypes/journal";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import JournalService, {
  IJournalService,
  JournalFavoriteRequest,
  JournalFavoriteResponse,
} from "services/JournalService";

export default fetchJournalFavorite(new JournalService());

export function fetchJournalFavorite(service: IJournalService) {
  return (request: JournalFavoriteRequest, setIsFetching?: boolean) =>
    async (dispatch: Function) => {
      try {
        if (setIsFetching) {
          dispatch(fetchJournalFavoriteRequested());
        }

        const result = await service.fetchJournalFavorite(request);

        if (result instanceof Success) {
          dispatch(fetchJournalFavoriteSuccess(result.data));
        }

        return result;
      } catch (e) {
        if (e instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(e));

          return;
        }

        throw e;
      }
    };
}

export const fetchJournalFavoriteRequested: ActionCreator<
  FetchJournalFavoriteRequested
> = () => ({
  type: FETCH_JOURNAL_FAVORITE_REQUESTED,
});

export const fetchJournalFavoriteSuccess: ActionCreator<
  FetchJournalFavoriteSuccess
> = (data: JournalFavoriteResponse) => ({
  type: FETCH_JOURNAL_FAVORITE_SUCCESS,
  payload: data,
});

export type FetchJournalFavoriteRequested = {
  type: typeof FETCH_JOURNAL_FAVORITE_REQUESTED;
};

export type FetchJournalFavoriteSuccess = {
  type: typeof FETCH_JOURNAL_FAVORITE_SUCCESS;
  payload: JournalFavoriteResponse;
};

export type FetchJournalFavoriteActions =
  FetchJournalFavoriteRequested | FetchJournalFavoriteSuccess;
