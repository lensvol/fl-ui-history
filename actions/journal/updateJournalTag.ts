import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  UPDATE_JOURNAL_TAG_REQUESTED,
  UPDATE_JOURNAL_TAG_SUCCESS,
} from "actiontypes/journal";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import JournalService, {
  FetchJournalTagResponse,
  IJournalService,
  UpdateJournalTagRequest,
  UpdateJournalTagResponse,
} from "services/JournalService";

export default updateJournalTag(new JournalService());

export function updateJournalTag(service: IJournalService) {
  return (request: UpdateJournalTagRequest, setIsCreating?: boolean) =>
    async (dispatch: Function) => {
      try {
        if (setIsCreating) {
          dispatch(updateJournalTagRequested());
        }

        const result = await service.updateJournalTag(request);

        if (result instanceof Success) {
          dispatch(updateJournalTagSuccess(result.data));
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

export const updateJournalTagRequested: ActionCreator<
  UpdateJournalTagRequested
> = () => ({
  type: UPDATE_JOURNAL_TAG_REQUESTED,
});

export const updateJournalTagSuccess: ActionCreator<UpdateJournalTagSuccess> = (
  data: FetchJournalTagResponse
) => ({
  type: UPDATE_JOURNAL_TAG_SUCCESS,
  payload: data,
});

export type UpdateJournalTagRequested = {
  type: typeof UPDATE_JOURNAL_TAG_REQUESTED;
};

export type UpdateJournalTagSuccess = {
  type: typeof UPDATE_JOURNAL_TAG_SUCCESS;
  payload: UpdateJournalTagResponse;
};

export type UpdateJournalTagActions =
  UpdateJournalTagRequested | UpdateJournalTagSuccess;
