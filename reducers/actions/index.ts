import { ActionsActions, ChronographActions } from "actions/actions";
import { MessagesAction } from "actions/messages";
import { FetchMyselfSuccess } from "actions/myself/fetchMyself";
import { UpdateMyself } from "actions/myself/updateMyself";
import { StoryletActions } from "actions/storylet";

import {
  ACTIONS_UPDATED,
  FETCH_ACTIONS_ERROR,
  FETCH_ACTIONS_REQUESTED,
  FETCH_ACTIONS_SUCCESS,
  RESET_CHRONOGRAPH_SUCCESS,
  TOGGLE_CHRONOGRAPH_REQUEST,
} from "actiontypes/actions";
import { ACCEPT_SUCCESS } from "actiontypes/messages";
import { FETCH_MYSELF_SUCCESS, MYSELF_CHANGED } from "actiontypes/myself";
import {
  CHOOSE_BRANCH_SUCCESS,
  CHOOSE_STORYLET_SUCCESS,
  FETCH_AVAILABLE_SUCCESS,
  GOBACK_SUCCESS,
} from "actiontypes/storylet";

import { CHRONOGRAPH_IDENTIFIER } from "reducers/actions/constants";
import fetchActionsSuccess from "reducers/actions/fetchActionsSuccess";

import { IActionsState } from "types/actions";

const INITIAL_STATE: IActionsState = {
  actionBankSize: 0,
  actions: 0,
  error: undefined,
  isFetching: false,
  chronograph: {
    isVisible: false,
    actionCount: 0,
  },
};

type ActionsReducerAction =
  | ActionsActions
  | ChronographActions
  | FetchMyselfSuccess
  | MessagesAction
  | StoryletActions
  | UpdateMyself;

export default function reducer(
  state = INITIAL_STATE,
  action: ActionsReducerAction
) {
  switch (action.type) {
    case ACTIONS_UPDATED:
    case GOBACK_SUCCESS:
      return {
        ...state,
        // If we have a payload value for `actions`, then update state;
        // otherwise, use existing state (in other words, don't clobber)
        actions:
          typeof action.payload.actions === "undefined"
            ? state.actions
            : action.payload.actions,
      };

    case ACCEPT_SUCCESS:
    case CHOOSE_STORYLET_SUCCESS:
    case FETCH_AVAILABLE_SUCCESS:
      return {
        ...state,
        // If we have a payload value for `actions`, then update state;
        // otherwise, use existing state (in other words, don't clobber)
        actions:
          typeof action.payload.actions === "undefined"
            ? state.actions
            : action.payload.actions,
        chronograph: {
          ...state.chronograph,
          actionCount:
            state.chronograph.actionCount + (action.payload.elapsed ?? 0),
        },
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
        chronograph: {
          ...state.chronograph,
          actionCount:
            state.chronograph.actionCount + (action.payload.elapsed ?? 0),
        },
      };

    case TOGGLE_CHRONOGRAPH_REQUEST:
      return {
        ...state,
        chronograph: {
          ...state.chronograph,
          isVisible: !state.chronograph.isVisible,
        },
      };

    case RESET_CHRONOGRAPH_SUCCESS:
      return {
        ...state,
        chronograph: {
          ...state.chronograph,
          actionCount: 0,
        },
      };

    case FETCH_MYSELF_SUCCESS:
      return {
        ...state,
        chronograph: {
          ...state.chronograph,
          actionCount:
            action.payload.possessions
              .flatMap((p) => p.possessions)
              .find((p) => p.id === CHRONOGRAPH_IDENTIFIER)?.level ??
            state.chronograph.actionCount,
        },
      };

    case MYSELF_CHANGED:
      return {
        ...state,
        chronograph: {
          ...state.chronograph,
          actionCount:
            action.payload.find(
              (p) => p.possession.id === CHRONOGRAPH_IDENTIFIER
            )?.possession.level ?? state.chronograph.actionCount,
        },
      };

    default:
      return state;
  }
}
