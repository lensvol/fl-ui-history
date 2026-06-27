import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_JOURNAL_PAGE_REQUESTED,
  FETCH_JOURNAL_PAGE_SUCCESS,
} from "actiontypes/journal";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import JournalService, {
  IJournalService,
  JournalPageRequest,
  JournalPageResponse,
} from "services/JournalService";

export default fetchJournalPage(new JournalService());

export function fetchJournalPage(service: IJournalService) {
  return (request: JournalPageRequest, setIsFetching?: boolean) =>
    async (dispatch: Function) => {
      try {
        if (setIsFetching) {
          dispatch(fetchJournalPageRequested());
        }

        const result = await service.fetchJournalPage(request);

        if (result instanceof Success) {
          dispatch(fetchJournalPageSuccess(result.data));
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

export const fetchJournalPageRequested: ActionCreator<
  FetchJournalPageRequested
> = () => ({
  type: FETCH_JOURNAL_PAGE_REQUESTED,
});

export const fetchJournalPageSuccess: ActionCreator<FetchJournalPageSuccess> = (
  data: JournalPageResponse
) => ({
  type: FETCH_JOURNAL_PAGE_SUCCESS,
  payload: data,
});

export type FetchJournalPageRequested = {
  type: typeof FETCH_JOURNAL_PAGE_REQUESTED;
};

export type FetchJournalPageSuccess = {
  type: typeof FETCH_JOURNAL_PAGE_SUCCESS;
  payload: JournalPageResponse;
};

export type FetchJournalPageActions =
  FetchJournalPageRequested | FetchJournalPageSuccess;
