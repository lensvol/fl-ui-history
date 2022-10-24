import { ActionsActions } from "actions/actions";
import { MessagesAction } from "actions/messages";
import { StoryletActions } from "actions/storylet";
import {
  ACTIONS_UPDATED,
  FETCH_ACTIONS_ERROR,
  FETCH_ACTIONS_REQUESTED,
  FETCH_ACTIONS_SUCCESS,
} from "actiontypes/actions";

import { ACCEPT_SUCCESS } from "actiontypes/messages";

import {
  CHOOSE_BRANCH_SUCCESS,
  CHOOSE_STORYLET_SUCCESS,
  FETCH_AVAILABLE_SUCCESS,
  GOBACK_SUCCESS,
} from "actiontypes/storylet";

import fetchActionsSuccess from "./fetchActionsSuccess";
import { IActionsState } from "types/actions";

const INITIAL_STATE: IActionsState = {
  actionBankSize: 0,
  actions: 0,
  error: undefined,
  isFetching: false,
};

export default function reducer(
  state = INITIAL_STATE,
  action: ActionsActions | StoryletActions | MessagesAction
) {
  switch (action.type) {
    case ACTIONS_UPDATED:
    case ACCEPT_SUCCESS:
    case CHOOSE_STORYLET_SUCCESS:
    case FETCH_AVAILABLE_SUCCESS:
    case GOBACK_SUCCESS:
      return {
        ...state,
        // If we have a payload value for `actions`, then update state;
        // otherwise, use existing state (in other worse, don't clobber)
        actions:
          typeof action.payload.actions === "undefined"
            ? state.actions
            : action.payload.actions,
      };

    case FETCH_ACTIONS_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };

    case FETCH_ACTIONS_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case FETCH_ACTIONS_SUCCESS:
      return fetchActionsSuccess(state, action.payload);

    case CHOOSE_BRANCH_SUCCESS:
      return {
        ...state,
        actions: action.payload.actions,
      };

    default:
      return state;
  }
}
