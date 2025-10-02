import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_JOURNAL_TAG_REQUESTED,
  FETCH_JOURNAL_TAG_SUCCESS,
} from "actiontypes/journal";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import JournalService, {
  FetchJournalTagResponse,
  IJournalService,
} from "services/JournalService";

export default fetchJournalTags(new JournalService());

export function fetchJournalTags(service: IJournalService) {
  return (setIsCreating?: boolean) => async (dispatch: Function) => {
    try {
      if (setIsCreating) {
        dispatch(fetchJournalTagRequested());
      }

      const result = await service.fetchJournalTags();

      if (result instanceof Success) {
        dispatch(fetchJournalTagSuccess(result.data));
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

export const fetchJournalTagRequested: ActionCreator<
  FetchJournalTagRequested
> = () => ({
  type: FETCH_JOURNAL_TAG_REQUESTED,
});

export const fetchJournalTagSuccess: ActionCreator<FetchJournalTagSuccess> = (
  data: FetchJournalTagResponse
) => ({
  type: FETCH_JOURNAL_TAG_SUCCESS,
  payload: data,
});

export type FetchJournalTagRequested = {
  type: typeof FETCH_JOURNAL_TAG_REQUESTED;
};

export type FetchJournalTagSuccess = {
  type: typeof FETCH_JOURNAL_TAG_SUCCESS;
  payload: FetchJournalTagResponse;
};

export type FetchJournalTagActions =
  | FetchJournalTagRequested
  | FetchJournalTagSuccess;
