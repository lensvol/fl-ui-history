import { handleVersionMismatch } from 'actions/versionSync';
import { CANCEL_FAILURE, CANCEL_REQUESTED, CANCEL_SUCCESS } from 'actiontypes/messages';
import { ActionCreator } from 'redux';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import MessagesService, { IMessagesService } from 'services/MessagesService';
import { processMessages } from 'actions/app';

export type CancelFailure = { type: typeof CANCEL_FAILURE };
export type CancelRequested = { type: typeof CANCEL_REQUESTED };
export type CancelSuccess = {
  type: typeof CANCEL_SUCCESS,
  payload: { cancelledId: number }
};

export type CancelAction = CancelFailure | CancelRequested | CancelSuccess;

const cancelRequested: ActionCreator<CancelRequested> = () => ({ type: CANCEL_REQUESTED });

const cancelSuccess: ActionCreator<CancelSuccess> = (eventId: number) => ({
  type: CANCEL_SUCCESS,
  payload: { cancelledId: eventId },
});

const cancelFailure: ActionCreator<CancelFailure> = (error: any) => ({
  type: CANCEL_FAILURE,
  error: true,
  status: error.response && error.response.status,
});

const messagesService: IMessagesService = new MessagesService();

/** ----------------------------------------------------------------------------
 * CANCEL A REQUEST
 -----------------------------------------------------------------------------*/
export default function cancel(eventId: number) {
  return async (dispatch: Function) => {
    dispatch(cancelRequested());
    try {
      const result = await messagesService.cancelInvitation(eventId);
      if (result instanceof Success) {
        const { data } = result;
        if (data && data.messages) {
          dispatch(processMessages(data.messages));
        }
        dispatch(cancelSuccess(eventId));
      } else {
        dispatch(cancelFailure(result.message));
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(cancelFailure(error));
      throw error;
    }
  };
}