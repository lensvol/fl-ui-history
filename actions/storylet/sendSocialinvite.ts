import { actionsUpdated } from "actions/actions";
import { processMessages } from "actions/app";
import { handleVersionMismatch } from "actions/versionSync";
import * as StoryletActionTypes from "actiontypes/storylet";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";
import StoryletService, {
  IApiStoryletResponseData,
  IStoryletService,
} from "services/StoryletService";
import { shouldFetch as shouldFetchOpportunityCards } from "actions/cards/fetch";

export type SendSocialInviteFailureAction = {
  type: typeof StoryletActionTypes.SEND_SOCIAL_INVITATION_FAILURE;
};
export type SendSocialInviteRequestedAction = {
  type: typeof StoryletActionTypes.SEND_SOCIAL_INVITATION_REQUESTED;
};
export type SendSocialInviteSuccessAction = {
  type: typeof StoryletActionTypes.SEND_SOCIAL_INVITATION_SUCCESS;
  payload: Pick<
    IApiStoryletResponseData,
    "phase" | "endStorylet" | "externalSocialAct" | "messages"
  >;
};

export type SendSocialInviteAction =
  | SendSocialInviteRequestedAction
  | SendSocialInviteFailureAction
  | SendSocialInviteSuccessAction;

export const sendSocialInviteRequested: ActionCreator<
  SendSocialInviteRequestedAction
> = () => ({
  type: StoryletActionTypes.SEND_SOCIAL_INVITATION_REQUESTED,
});

export const sendSocialInviteSuccess = (data: any) => ({
  type: StoryletActionTypes.SEND_SOCIAL_INVITATION_SUCCESS,
  payload: {
    phase: data.phase,
    endStorylet: data.endStorylet,
    externalSocialAct: data.externalSocialAct,
    messages: data.messages,
  },
});

export const sendSocialInviteFailure = (error: any) => ({
  type: StoryletActionTypes.SEND_SOCIAL_INVITATION_FAILURE,
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

        // If we have some result messages with quality changes, then
        // process them
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
