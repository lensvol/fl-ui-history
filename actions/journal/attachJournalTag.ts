import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  ATTACH_JOURNAL_TAG_REQUESTED,
  ATTACH_JOURNAL_TAG_SUCCESS,
} from "actiontypes/journal";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import JournalService, {
  AttachJournalTagRequest,
  AttachJournalTagResponse,
  FetchJournalTagResponse,
  IJournalService,
} from "services/JournalService";

export default attachJournalTag(new JournalService());

export function attachJournalTag(service: IJournalService) {
  return (request: AttachJournalTagRequest, setIsCreating?: boolean) =>
    async (dispatch: Function) => {
      try {
        if (setIsCreating) {
          dispatch(attachJournalTagRequested());
        }

        const result = await service.attachJournalTag(request);

        if (result instanceof Success) {
          dispatch(attachJournalTagSuccess(result.data, request.entryId));
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

export const attachJournalTagRequested: ActionCreator<
  AttachJournalTagRequested
> = () => ({
  type: ATTACH_JOURNAL_TAG_REQUESTED,
});

export const attachJournalTagSuccess: ActionCreator<AttachJournalTagSuccess> = (
  data: FetchJournalTagResponse,
  entryId: number
) => ({
  type: ATTACH_JOURNAL_TAG_SUCCESS,
  payload: {
    ...data,
    entryId,
  },
});

export type AttachJournalTagRequested = {
  type: typeof ATTACH_JOURNAL_TAG_REQUESTED;
};

export type AttachJournalTagSuccess = {
  type: typeof ATTACH_JOURNAL_TAG_SUCCESS;
  payload: AttachJournalTagResponse;
};

export type AttachJournalTagActions =
  | AttachJournalTagRequested
  | AttachJournalTagSuccess;
