import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_AVAILABLE_IN_BACKGROUND_REQUESTED,
  FETCH_AVAILABLE_FAILURE,
  FETCH_AVAILABLE_REQUESTED,
  FETCH_AVAILABLE_SUCCESS,
} from "actiontypes/storylet";
import { processMessages } from "actions/app";
import { ActionCreator } from "redux";
import { VersionMismatch } from "services/BaseService";
import StoryletService, {
  IApiStoryletResponseData,
  IStoryletService,
} from "services/StoryletService";

export type FetchAvailableFailureAction = {
  type: typeof FETCH_AVAILABLE_FAILURE;
  error: boolean;
  status?: number;
};

export type FetchAvailableInBackgroundRequestedAction = {
  type: typeof FETCH_AVAILABLE_IN_BACKGROUND_REQUESTED;
};

export type FetchAvailableRequestedAction = {
  type: typeof FETCH_AVAILABLE_REQUESTED;
};

type AnyFetchAvailableAction =
  | FetchAvailableInBackgroundRequestedAction
  | FetchAvailableRequestedAction;

export type FetchAvailableSuccessAction = {
  type: typeof FETCH_AVAILABLE_SUCCESS;
  payload: Pick<
    IApiStoryletResponseData,
    | "actions"
    | "canChangeOutfit"
    | "endStorylet"
    | "phase"
    | "storylets"
    | "storylet"
    | "messages"
  >;
};

const fetchAvailableRequest: ActionCreator<AnyFetchAvailableAction> = (
  setisFetching: boolean
) => ({
  type: setisFetching
    ? FETCH_AVAILABLE_REQUESTED
    : FETCH_AVAILABLE_IN_BACKGROUND_REQUESTED,
  phase: null,
});

export const fetchAvailableSuccess: ActionCreator<
  FetchAvailableSuccessAction
> = (data: IApiStoryletResponseData) => ({
  type: FETCH_AVAILABLE_SUCCESS,
  payload: {
    actions: data.actions,
    canChangeOutfit: data.canChangeOutfit,
    endStorylet: data.endStorylet,
    phase: data.phase,
    storylets: data.storylets,
    storylet: data.storylet,
    messages: data.messages,
  },
});

const fetchAvailableFailure: ActionCreator<FetchAvailableFailureAction> = (
  error: any
) => ({
  type: FETCH_AVAILABLE_FAILURE,
  error: true,
  status: error && error.response && error.response.status,
});

const service: IStoryletService = new StoryletService();

export default function fetchAvailable({ setIsFetching = true } = {}) {
  return async (dispatch: Function) => {
    // eslint-disable-line
    dispatch(fetchAvailableRequest(setIsFetching));

    try {
      const { data }: { data: IApiStoryletResponseData } =
        await service.fetchAvailable();
      dispatch(fetchAvailableSuccess(data));
      const { messages } = data;
      if (messages) {
        dispatch(processMessages(messages));
      }
      return data; // Return obj for chaining
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(fetchAvailableFailure(error));
      return error;
    }
  };
}
