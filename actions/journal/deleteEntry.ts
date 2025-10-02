import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  DELETE_JOURNAL_ENTRY_FAILURE,
  DELETE_JOURNAL_ENTRY_REQUESTED,
  DELETE_JOURNAL_ENTRY_SUCCESS,
} from "actiontypes/journal";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import JournalService, {
  DeleteJournalEntryRequest,
  DeleteJournalEntryResponse,
  IJournalService,
} from "services/JournalService";

export default deleteJournalEntry(new JournalService());

function deleteJournalEntry(service: IJournalService) {
  return (request: DeleteJournalEntryRequest, setIsCreating?: boolean) =>
    async (dispatch: Function) => {
      try {
        if (setIsCreating) {
          dispatch(deleteJournalEntryRequested());
        }

        const result = await service.deleteJournalEntry(request);

        if (result instanceof Success) {
          dispatch(deleteJournalEntrySuccess(result.data));
        } else {
          dispatch(deleteJournalEntryFailure());
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

export const deleteJournalEntryRequested: ActionCreator<
  DeleteJournalEntryRequested
> = () => ({
  type: DELETE_JOURNAL_ENTRY_REQUESTED,
});

export const deleteJournalEntrySuccess: ActionCreator<
  DeleteJournalEntrySuccess
> = (data: DeleteJournalEntryResponse) => ({
  type: DELETE_JOURNAL_ENTRY_SUCCESS,
  payload: data,
});

export const deleteJournalEntryFailure: ActionCreator<
  DeleteJournalEntryFailure
> = () => ({
  type: DELETE_JOURNAL_ENTRY_FAILURE,
});

export type DeleteJournalEntryRequested = {
  type: typeof DELETE_JOURNAL_ENTRY_REQUESTED;
};

export type DeleteJournalEntrySuccess = {
  type: typeof DELETE_JOURNAL_ENTRY_SUCCESS;
  payload: DeleteJournalEntryResponse;
};

export type DeleteJournalEntryFailure = {
  type: typeof DELETE_JOURNAL_ENTRY_FAILURE;
};

export type DeleteJournalEntryActions =
  | DeleteJournalEntryFailure
  | DeleteJournalEntryRequested
  | DeleteJournalEntrySuccess;
