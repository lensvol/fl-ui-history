import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  DETACH_JOURNAL_TAG_REQUESTED,
  DETACH_JOURNAL_TAG_SUCCESS,
} from "actiontypes/journal";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import JournalService, {
  DetachJournalTagRequest,
  DetachJournalTagResponse,
  FetchJournalTagResponse,
  IJournalService,
} from "services/JournalService";

export default detachJournalTag(new JournalService());

export function detachJournalTag(service: IJournalService) {
  return (request: DetachJournalTagRequest, setIsCreating?: boolean) =>
    async (dispatch: Function) => {
      try {
        if (setIsCreating) {
          dispatch(detachJournalTagRequested());
        }

        const result = await service.detachJournalTag(request);

        if (result instanceof Success) {
          dispatch(detachJournalTagSuccess(result.data, request.entryId));
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

export const detachJournalTagRequested: ActionCreator<
  DetachJournalTagRequested
> = () => ({
  type: DETACH_JOURNAL_TAG_REQUESTED,
});

export const detachJournalTagSuccess: ActionCreator<DetachJournalTagSuccess> = (
  data: FetchJournalTagResponse,
  entryId: number
) => ({
  type: DETACH_JOURNAL_TAG_SUCCESS,
  payload: {
    ...data,
    entryId,
  },
});

export type DetachJournalTagRequested = {
  type: typeof DETACH_JOURNAL_TAG_REQUESTED;
};

export type DetachJournalTagSuccess = {
  type: typeof DETACH_JOURNAL_TAG_SUCCESS;
  payload: DetachJournalTagResponse;
};

export type DetachJournalTagActions =
  DetachJournalTagRequested | DetachJournalTagSuccess;
