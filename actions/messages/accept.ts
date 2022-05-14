import { handleVersionMismatch } from 'actions/versionSync';
import { ACCEPT_FAILURE, ACCEPT_REQUESTED, ACCEPT_SUCCESS } from 'actiontypes/messages';
import { processMessages } from 'actions/app';
import { ActionCreator } from 'redux';
import { Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';
import MessagesService, { AcceptInvitationResponse } from 'services/MessagesService';

const service = new MessagesService();

export type AcceptFailure = { type: typeof ACCEPT_FAILURE };
export type AcceptRequested = { type: typeof ACCEPT_REQUESTED };
export type AcceptSuccess = {
  type: typeof ACCEPT_SUCCESS,
  payload: AcceptInvitationResponse & { id: number },
};

export type AcceptAction = AcceptFailure | AcceptRequested | AcceptSuccess;

const acceptRequested: ActionCreator<AcceptRequested> = () => ({ type: ACCEPT_REQUESTED });

const acceptSuccess: ActionCreator<AcceptSuccess> = (
  invitationId: number,
  data: AcceptInvitationResponse,
) => ({
  type: ACCEPT_SUCCESS,
  payload: { ...data, id: invitationId },
});

const acceptFailure: ActionCreator<AcceptFailure> = (_error?: any) => ({
  type: ACCEPT_FAILURE,
});

export default function accept(invitationId: number) {
  return async (dispatch: Function) => {
    dispatch(acceptRequested());

    try {
      const result = await service.acceptInvitation(invitationId);
      if (result instanceof Success) {
        const { data } = result;
        dispatch(acceptSuccess(invitationId, data));
        const { messages } = data;
        if (messages) {
          dispatch(processMessages(messages));
        }
      } else {
        dispatch(acceptFailure());
      }
      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        return error;
      }
      dispatch(acceptFailure(error));
      return error;
    }
  };
}