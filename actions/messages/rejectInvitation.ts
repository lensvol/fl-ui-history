import { ActionCreator } from "redux";

import { handleVersionMismatch } from "actions/versionSync";

import {
  REJECT_FAILURE,
  REJECT_REQUESTED,
  REJECT_SUCCESS,
} from "actiontypes/messages";

import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import MessagesService, { IMessagesService } from "services/MessagesService";

type RejectFailure = {
  type: typeof REJECT_FAILURE;
};

type RejectRequested = {
  type: typeof REJECT_REQUESTED;
};

type RejectSuccess = {
  type: typeof REJECT_SUCCESS;
  payload: {
    invitationId: number;
  };
};

export type RejectAction = RejectFailure | RejectRequested | RejectSuccess;

const rejectRequested: ActionCreator<RejectRequested> = () => ({
  type: REJECT_REQUESTED,
});

const rejectSuccess: ActionCreator<RejectSuccess> = (invitationId: number) => ({
  type: REJECT_SUCCESS,
  payload: {
    invitationId,
  },
});

const rejectFailure = (error: any) => ({
  type: REJECT_FAILURE,
  error: true,
  status: error.response && error.response.status,
});

/** ----------------------------------------------------------------------------
 * REJECT A REQUEST
 -----------------------------------------------------------------------------*/
export default rejectInvitation(new MessagesService());

function rejectInvitation(service: IMessagesService) {
  return (invitationId: number) => async (dispatch: Function) => {
    dispatch(rejectRequested());

    try {
      const result = await service.rejectInvitation(invitationId);

      if (result instanceof Success) {
        dispatch(rejectSuccess(invitationId));
      }
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }

      dispatch(rejectFailure(error));
    }
  };
}
