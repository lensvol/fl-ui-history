import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_ALL_FAILURE,
  FETCH_ALL_REQUESTED,
  FETCH_ALL_SUCCESS,
  FETCH_QUEUED,
} from "actiontypes/messages";
import * as MessagesActionTypes from "actiontypes/messages";
import { ActionCreator } from "redux";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import MessageService, {
  FetchAllMessagesResponse,
  IMessagesService,
} from "services/MessagesService";

export type FetchAllFailure = { type: typeof FETCH_ALL_FAILURE };

export type FetchAllRequested = { type: typeof FETCH_ALL_REQUESTED };

export type FetchAllSuccess = {
  type: typeof FETCH_ALL_SUCCESS;
  payload: FetchAllMessagesResponse;
};

export type FetchQueued = { type: typeof FETCH_QUEUED };

export type FetchAllAction =
  | FetchAllFailure
  | FetchAllRequested
  | FetchAllSuccess;

const messagesService: IMessagesService = new MessageService();

/** ----------------------------------------------------------------------------
 * FETCH ALL MESSAGES
 -----------------------------------------------------------------------------*/
export default function fetch() {
  return async (dispatch: Function) => {
    if (document.hidden) {
      document.onvisibilitychange = () => {
        document.onvisibilitychange = null;
        dispatch(fetch());
      };

      return dispatch(fetchQueued());
    }

    document.onvisibilitychange = null;
    dispatch(fetchRequested());

    try {
      const result = await messagesService.fetchAll();

      if (result instanceof Success) {
        dispatch(fetchSuccess(result.data));
      } else {
        dispatch(fetchFailure(result.message));
      }
      return result;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
      }

      // TODO: throw an error when IsSuccess is false?
      dispatch(fetchFailure(e));
    }
  };
}

export const fetchRequested: ActionCreator<FetchAllRequested> = () => {
  return { type: MessagesActionTypes.FETCH_ALL_REQUESTED };
};

export const fetchSuccess: ActionCreator<FetchAllSuccess> = (
  data: any,
  type = MessagesActionTypes.FETCH_ALL_SUCCESS
) => ({
  type,
  payload: {
    interactions: data.interactions,
    feedMessages: data.feedMessages,
  },
});

export const fetchFailure = (error: any) => ({
  type: MessagesActionTypes.FETCH_ALL_FAILURE,
  status: error.response?.status,
});

const fetchQueued: ActionCreator<FetchQueued> = () => ({
  type: MessagesActionTypes.FETCH_QUEUED,
});
