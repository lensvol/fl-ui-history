import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  DELETE_JOURNAL_TAG_REQUESTED,
  DELETE_JOURNAL_TAG_SUCCESS,
} from "actiontypes/journal";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import JournalService, {
  DeleteJournalTagResponse,
  FetchJournalTagResponse,
  IJournalService,
} from "services/JournalService";

export default deleteJournalTag(new JournalService());

export function deleteJournalTag(service: IJournalService) {
  return (tagId: number, setIsCreating?: boolean) =>
    async (dispatch: Function) => {
      try {
        if (setIsCreating) {
          dispatch(deleteJournalTagRequested());
        }

        const result = await service.deleteJournalTag(tagId);

        if (result instanceof Success) {
          dispatch(deleteJournalTagSuccess(result.data, tagId));
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

export const deleteJournalTagRequested: ActionCreator<
  DeleteJournalTagRequested
> = () => ({
  type: DELETE_JOURNAL_TAG_REQUESTED,
});

export const deleteJournalTagSuccess: ActionCreator<DeleteJournalTagSuccess> = (
  data: FetchJournalTagResponse,
  tagId: number
) => ({
  type: DELETE_JOURNAL_TAG_SUCCESS,
  payload: {
    ...data,
    tagId,
  },
});

export type DeleteJournalTagRequested = {
  type: typeof DELETE_JOURNAL_TAG_REQUESTED;
};

export type DeleteJournalTagSuccess = {
  type: typeof DELETE_JOURNAL_TAG_SUCCESS;
  payload: DeleteJournalTagResponse;
};

export type DeleteJournalTagActions =
  DeleteJournalTagRequested | DeleteJournalTagSuccess;
