import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  CREATE_JOURNAL_TAG_REQUESTED,
  CREATE_JOURNAL_TAG_SUCCESS,
} from "actiontypes/journal";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import JournalService, {
  CreateJournalTagResponse,
  IJournalService,
} from "services/JournalService";

export default createJournalTag(new JournalService());

export function createJournalTag(service: IJournalService) {
  return (tagName: string, setIsCreating?: boolean) =>
    async (dispatch: Function) => {
      try {
        if (setIsCreating) {
          dispatch(createJournalTagRequested());
        }

        const result = await service.createJournalTag(tagName);

        if (result instanceof Success) {
          dispatch(createJournalTagSuccess(result.data));
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

export const createJournalTagRequested: ActionCreator<
  CreateJournalTagRequested
> = () => ({
  type: CREATE_JOURNAL_TAG_REQUESTED,
});

export const createJournalTagSuccess: ActionCreator<CreateJournalTagSuccess> = (
  data: CreateJournalTagResponse
) => ({
  type: CREATE_JOURNAL_TAG_SUCCESS,
  payload: data,
});

export type CreateJournalTagRequested = {
  type: typeof CREATE_JOURNAL_TAG_REQUESTED;
};

export type CreateJournalTagSuccess = {
  type: typeof CREATE_JOURNAL_TAG_SUCCESS;
  payload: CreateJournalTagResponse;
};

export type CreateJournalTagActions =
  | CreateJournalTagRequested
  | CreateJournalTagSuccess;
