import { handleVersionMismatch } from 'actions/versionSync';
import { DELETE_FAILURE, DELETE_REQUESTED, DELETE_SUCCESS } from 'actiontypes/messages';
import { ActionCreator } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import MessagesService, { IMessagesService } from 'services/MessagesService';

export type DeleteRequested = { type: typeof DELETE_REQUESTED };
export type DeleteFailure = {
  type: typeof DELETE_FAILURE,
  status?: number,
};
export type DeleteSuccess = {
  type: typeof DELETE_SUCCESS,
  payload: number,
};

export type DeleteAction = DeleteFailure | DeleteRequested | DeleteSuccess;

const deleteRequested: ActionCreator<DeleteRequested> = () => ({
  type: DELETE_REQUESTED,
});

const deleteSuccess: ActionCreator<DeleteSuccess> = (messageId: number) => ({
  type: DELETE_SUCCESS,
  payload: messageId,
});

const deleteFailure: ActionCreator<DeleteFailure> = (error: any) => ({
  type: DELETE_FAILURE,
  error: true,
  status: error.response?.status,
});

const messagesService: IMessagesService = new MessagesService();

/** ----------------------------------------------------------------------------
 * DELETE A MESSAGE
 -----------------------------------------------------------------------------*/
export default function deleteMessage(messageId: number) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(deleteRequested());
    try {
      const result = await messagesService.deleteMessage(messageId);
      if (result instanceof Success) {
        dispatch(deleteSuccess(messageId));
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(deleteFailure(error));
      throw error;
    }
  };
}