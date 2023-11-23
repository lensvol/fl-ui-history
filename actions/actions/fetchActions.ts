import { setNextAvailable } from "actions/timer";
import { handleVersionMismatch } from "actions/versionSync";
import { ActionCreator } from "redux";
import { VersionMismatch } from "services/BaseService";
import {
  FetchActionsResponse,
  FetchEnhancedActionsResponse,
  IActionsService,
} from "types/actions";
import computeNextActionsAt from "utils/computeNextActionsAt";
import ActionsService from "services/ActionsService";

import {
  FETCH_ACTIONS_ERROR,
  FETCH_ACTIONS_REQUESTED,
  FETCH_ACTIONS_SUCCESS,
  FETCH_ENHANCED_ACTIONS_SUCCESS,
} from "actiontypes/actions";
import { logoutUser } from "actions/user";
import { Failure, Success } from "services/BaseMonadicService";
import { AppDispatch } from "features/app/store";

export type FetchActionsRequested = { type: typeof FETCH_ACTIONS_REQUESTED };
export type FetchActionsError = {
  type: typeof FETCH_ACTIONS_ERROR;
  error: any;
};
export type FetchActionsSuccess = {
  type: typeof FETCH_ACTIONS_SUCCESS;
  payload: FetchActionsResponse;
};

export type FetchEnhancedActionsSuccess = {
  type: typeof FETCH_ENHANCED_ACTIONS_SUCCESS;
  payload: FetchEnhancedActionsResponse;
};

export type FetchActionsActions =
  | FetchActionsRequested
  | FetchActionsError
  | FetchActionsSuccess;

export const fetchActionsError: ActionCreator<FetchActionsError> = (
  error: any
) => ({
  error,
  type: FETCH_ACTIONS_ERROR,
});

export const fetchActionsRequested: ActionCreator<
  FetchActionsRequested
> = () => ({ type: FETCH_ACTIONS_REQUESTED });

export const fetchActionsSuccess: ActionCreator<FetchActionsSuccess> = (
  data: FetchActionsResponse
) => ({
  type: FETCH_ACTIONS_SUCCESS,
  payload: data,
});

const fetchEnhancedActionsSuccess: ActionCreator<
  FetchEnhancedActionsSuccess
> = (data: FetchEnhancedActionsResponse) => ({
  type: FETCH_ENHANCED_ACTIONS_SUCCESS,
  payload: data,
});

export default fetchActions(new ActionsService());

export function fetchActions(service: IActionsService) {
  return () => async (dispatch: AppDispatch) => {
    dispatch(fetchActionsRequested());
    try {
      const result: Success<FetchActionsResponse> | Failure =
        await service.fetchActions();

      // We've got actions data from the server; let's use it
      if (result instanceof Success) {
        const { data } = result;
        dispatch(fetchActionsSuccess(data)); // update actions state slice
        dispatch(fetchEnhancedActionsSuccess(data)); // update actions state slice

        const nextActionsAt = computeNextActionsAt(data);
        dispatch(setNextAvailable(nextActionsAt)); // update timer's awareness
      }

      // Success or failure, return the result
      return result;
    } catch (error) {
      // Handle and return version mismatch errors
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
        throw error;
      }

      // Unauthorized requests are easy to handle too
      if (error.response?.status === 401) {
        dispatch(logoutUser());
        throw error;
      }

      // We're in some kind of completely unexpected state, so put
      // the actions reducer into an error state to prevent the timer
      // from spamming refresh requests, then rethrow
      dispatch(fetchActionsError(error));
      throw error;
    }
  };
}
