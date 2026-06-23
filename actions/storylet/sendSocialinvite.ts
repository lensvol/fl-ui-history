import { ActionCreator } from "redux";

import { ThunkDispatch } from "redux-thunk";

import { actionsUpdated } from "actions/actions";
import { processMessages } from "actions/app";
import { shouldFetch as shouldFetchOpportunityCards } from "actions/cards/fetch";
import { handleVersionMismatch } from "actions/versionSync";

import {
  SEND_SOCIAL_INVITATION_FAILURE,
  SEND_SOCIAL_INVITATION_REQUESTED,
  SEND_SOCIAL_INVITATION_SUCCESS,
} from "actiontypes/storylet";

import { VersionMismatch } from "services/BaseService";
import StoryletService, {
  IApiStoryletResponseData,
  IStoryletService,
} from "services/StoryletService";

type SendSocialInviteFailureAction = {
  type: typeof SEND_SOCIAL_INVITATION_FAILURE;
};

type SendSocialInviteRequestedAction = {
  type: typeof SEND_SOCIAL_INVITATION_REQUESTED;
};

export type SendSocialInviteSuccessAction = {
  type: typeof SEND_SOCIAL_INVITATION_SUCCESS;
  payload: Pick<
    IApiStoryletResponseData,
    "phase" | "endStorylet" | "elapsed" | "messages"
  >;
};

export type SendSocialInviteAction =
  | SendSocialInviteRequestedAction
  | SendSocialInviteFailureAction
  | SendSocialInviteSuccessAction;

const sendSocialInviteRequested: ActionCreator<
  SendSocialInviteRequestedAction
> = () => ({
  type: SEND_SOCIAL_INVITATION_REQUESTED,
});

const sendSocialInviteSuccess = (data: any) => ({
  type: SEND_SOCIAL_INVITATION_SUCCESS,
  payload: {
    elapsed: data.elapsed,
    endStorylet: data.endStorylet,
    messages: data.messages,
    phase: data.phase,
  },
});

const sendSocialInviteFailure = (error: any) => ({
  type: SEND_SOCIAL_INVITATION_FAILURE,
  error: true,
  status: error.response && error.response.status,
});

export default sendSocialInvite(new StoryletService());

export function sendSocialInvite(service: IStoryletService) {
  return (invitation: any) =>
    async (dispatch: ThunkDispatch<any, any, any>) => {
      dispatch(sendSocialInviteRequested());

      try {
        const { data } = await service.sendSocialInvite(invitation);

        dispatch(sendSocialInviteSuccess(data));

        // Update actions
        dispatch(actionsUpdated(data));

        // We also need to set card state to dirty so that we'll update later
        dispatch(shouldFetchOpportunityCards());

        // If we have some result messages with quality changes, then process them
        const { messages } = data;

        if (messages) {
          dispatch(processMessages(messages));
        }

        return data;
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));
        }

        dispatch(sendSocialInviteFailure(error));

        return error;
      }
    };
}
