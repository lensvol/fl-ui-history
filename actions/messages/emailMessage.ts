import { handleVersionMismatch } from "actions/versionSync";
import {
  EMAIL_FAILURE,
  EMAIL_REQUESTED,
  EMAIL_SUCCESS,
} from "actiontypes/messages";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import MessagesService, { IMessagesService } from "services/MessagesService";

export type EmailRequested = {
  type: typeof EMAIL_REQUESTED;
};

export type EmailSuccess = {
  type: typeof EMAIL_SUCCESS;
  payload: number;
};

export type EmailFailure = {
  type: typeof EMAIL_FAILURE;
  status?: number;
};

export type EmailAction = EmailRequested | EmailSuccess | EmailFailure;

const emailRequested: ActionCreator<EmailRequested> = () => ({
  type: EMAIL_REQUESTED,
});

const emailSuccess: ActionCreator<EmailSuccess> = (messageId: number) => ({
  type: EMAIL_SUCCESS,
  payload: messageId,
});

const emailFailure: ActionCreator<EmailFailure> = (error: any) => ({
  type: EMAIL_FAILURE,
  error: true,
  status: error.response?.status,
});

const messagesService: IMessagesService = new MessagesService();

/** ----------------------------------------------------------------------------
 * EMAIL A MESSAGE
 -----------------------------------------------------------------------------*/
export default function emailMessage(messageId: number) {
  return async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(emailRequested());

    try {
      const result = await messagesService.emailMessage(messageId);

      if (result instanceof Success) {
        dispatch(emailSuccess(messageId));
      }

      return result;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));

        return error;
      }

      dispatch(emailFailure(error));

      throw error;
    }
  };
}
