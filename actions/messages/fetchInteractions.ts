import { handleVersionMismatch } from 'actions/versionSync';
import {
  FETCH_INTERACTIONS_REQUESTED,
  FETCH_INTERACTIONS_SUCCESS,
} from 'actiontypes/messages';
import { ActionCreator } from 'redux';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import MessagesService, { IMessagesService, Message } from 'services/MessagesService';

export type FetchInteractionsRequested = { type: typeof FETCH_INTERACTIONS_REQUESTED };
export type FetchInteractionsSuccess = {
  type: typeof FETCH_INTERACTIONS_SUCCESS,
  payload: Message[],
};

export type FetchInteractionsAction = FetchInteractionsRequested | FetchInteractionsSuccess;

export const fetchInteractionsRequested: ActionCreator<FetchInteractionsRequested> = () => ({
  type: FETCH_INTERACTIONS_REQUESTED ,
});

export const fetchInteractionsSuccess: ActionCreator<FetchInteractionsSuccess> = (data: Message[]) => ({
  type: FETCH_INTERACTIONS_SUCCESS,
  payload: data,
});

export default fetchInteractions(new MessagesService());

export function fetchInteractions(service: IMessagesService) {
  return () => async (dispatch: Function) => {
    dispatch(fetchInteractionsRequested());
    try {
      const result = await service.fetch('interactions');
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