import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_FEED_MESSAGES_REQUESTED,
  FETCH_FEED_MESSAGES_SUCCESS,
} from "actiontypes/messages";
import { ActionCreator } from "redux";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import MessagesService, {
  IMessagesService,
  Message,
} from "services/MessagesService";

export type FetchFeedMessagesRequested = {
  type: typeof FETCH_FEED_MESSAGES_REQUESTED;
};

export type FetchFeedMessagesSuccess = {
  type: typeof FETCH_FEED_MESSAGES_SUCCESS;
  payload: Message[];
};

export type FetchFeedMessagesAction =
  | FetchFeedMessagesRequested
  | FetchFeedMessagesSuccess;

export default fetchFeedMessages(new MessagesService());

export function fetchFeedMessages(service: IMessagesService) {
  return () => async (dispatch: Function) => {
    try {
      dispatch(fetchFeedMessagesRequested());
      const result = await service.fetch("feed");
      if (result instanceof Success) {
        dispatch(fetchFeedMessagesSuccess(result.data));
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

export const fetchFeedMessagesRequested: ActionCreator<
  FetchFeedMessagesRequested
> = () => ({
  type: FETCH_FEED_MESSAGES_REQUESTED,
});

export const fetchFeedMessagesSuccess: ActionCreator<
  FetchFeedMessagesSuccess
> = (data: Message[]) => ({
  type: FETCH_FEED_MESSAGES_SUCCESS,
  payload: data,
});
