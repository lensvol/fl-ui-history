import { ActionCreator } from "redux";

import { ThunkDispatch } from "redux-thunk";

import fetchAvailable from "actions/storylet/fetchAvailable";
import { handleVersionMismatch } from "actions/versionSync";

import {
  BEGIN_SOCIAL_EVENT_FAILURE,
  BEGIN_SOCIAL_EVENT_REQUESTED,
  BEGIN_SOCIAL_EVENT_SUCCESS,
  BEGIN_SOCIAL_EVENT_UNAVAILABLE,
} from "actiontypes/storylet";

import { VersionMismatch } from "services/BaseService";
import StoryletService, {
  IApiStoryletResponseData,
  IStoryletService,
} from "services/StoryletService";

export type BeginSocialEventRequestedAction = {
  type: typeof BEGIN_SOCIAL_EVENT_REQUESTED;
};

export type BeginSocialEventSuccessAction = {
  type: typeof BEGIN_SOCIAL_EVENT_SUCCESS;
  payload: Pick<IApiStoryletResponseData, "storylet" | "phase" | "messages"> & {
    invitationId: number;
  };
};

export type BeginSocialEventFailureAction = {
  type: typeof BEGIN_SOCIAL_EVENT_FAILURE;
};

export type BeginSocialEventUnavailableAction = {
  type: typeof BEGIN_SOCIAL_EVENT_UNAVAILABLE;
  payload: {
    message: string;
  };
};

export type BeginSocialEventAction =
  | BeginSocialEventRequestedAction
  | BeginSocialEventFailureAction
  | BeginSocialEventUnavailableAction
  | BeginSocialEventSuccessAction;

const beginSocialEventUnavailable: ActionCreator<
  BeginSocialEventUnavailableAction
> = (data: { message: string }) => ({
  type: BEGIN_SOCIAL_EVENT_UNAVAILABLE,
  payload: {
    message: data.message,
  },
});

const beginSocialEventRequested: ActionCreator<
  BeginSocialEventRequestedAction
> = (_invitationId: number) => ({
  type: BEGIN_SOCIAL_EVENT_REQUESTED,
});

const beginSocialEventSuccess: ActionCreator<BeginSocialEventSuccessAction> = (
  invitationId: number
) => ({
  type: BEGIN_SOCIAL_EVENT_SUCCESS,
  payload: {
    invitationId,
    phase: "In",
    storylet: undefined,
  },
});

const beginSocialEventFailure: ActionCreator<BeginSocialEventFailureAction> = (
  error: any
) => ({
  type: BEGIN_SOCIAL_EVENT_FAILURE,
  error: true,
  isFetching: false,
  status: error.response && error.response.status,
});

export default beginSocialEvent(new StoryletService());

export function beginSocialEvent(service: IStoryletService) {
  return (invitationId: number) =>
    async (dispatch: ThunkDispatch<any, any, any>) => {
      dispatch(beginSocialEventRequested(invitationId));

      try {
        const { data } = await service.beginSocialEvent(invitationId);

        if (data.isSuccess) {
          dispatch(beginSocialEventSuccess(invitationId));
          dispatch(fetchAvailable()); // Get slets for this social event
        } else {
          dispatch(beginSocialEventUnavailable(data));
        }

        // Return the data
        return data;
      } catch (error) {
        if (error instanceof VersionMismatch) {
          dispatch(handleVersionMismatch(error));

          return error;
        }
        dispatch(beginSocialEventFailure(error));

        throw error;
      }
    };
}
