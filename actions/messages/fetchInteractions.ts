import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  FETCH_INTERACTIONS_REQUESTED,
  FETCH_INTERACTIONS_SUCCESS,
} from "actiontypes/messages";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import { IMessagesService, Message } from "services/MessagesService";

type FetchInteractionsRequested = {
  type: typeof FETCH_INTERACTIONS_REQUESTED;
};

type FetchInteractionsSuccess = {
  type: typeof FETCH_INTERACTIONS_SUCCESS;
  payload: Message[];
};

export type FetchInteractionsAction =
  FetchInteractionsRequested | FetchInteractionsSuccess;

const fetchInteractionsRequested: ActionCreator<
  FetchInteractionsRequested
> = () => ({
  type: FETCH_INTERACTIONS_REQUESTED,
});

const fetchInteractionsSuccess: ActionCreator<FetchInteractionsSuccess> = (
  data: Message[]
) => ({
  type: FETCH_INTERACTIONS_SUCCESS,
  payload: data,
});

export default function fetchInteractions(service: IMessagesService) {
  return () => async (dispatch: Function) => {
    dispatch(fetchInteractionsRequested());

    try {
      const result = await service.fetch("interactions");

      if (result instanceof Success) {
        const { data } = result;

        dispatch(fetchInteractionsSuccess(data));
      }

      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));

        return;
      }

      throw error;
    }
  };
}
