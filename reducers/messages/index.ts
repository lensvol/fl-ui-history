import { StoryletActions } from "actions/storylet";
import { IMessagesState } from "types/messages";
import { MessagesAction } from "actions/messages";

import * as MessageActionTypes from "actiontypes/messages";
import * as StoryletActionTypes from "actiontypes/storylet";

import acceptSuccess from "./acceptSuccess";
import sortByDate from "./sortByDate";
import updateAndExclude from "./updateAndExclude";

/**
 * Initial state
 * @type {Object}
 */
const INITIAL_STATE: IMessagesState = {
  isAccepting: false,
  isFetching: false,
  isDeleting: false,
  isCancelling: false,
  isRequesting: false,
  isChanged: null,
  feedMessages: [],
  interactions: [],
  dialogOpen: false,
  dialogMessage: null,
  subtab: "blah",
};

/**
 * Messages Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
export default function reducer(
  state = INITIAL_STATE,
  action: MessagesAction | StoryletActions
) {
  // const { payload } = action;
  // const { payload = {} } = action;

  switch (action.type) {
    case MessageActionTypes.CLEAR_CACHE:
      return INITIAL_STATE;

    case MessageActionTypes.FETCH_ALL_REQUESTED:
      return { ...state, isFetching: true };

    case MessageActionTypes.FETCH_ALL_FAILURE:
      return { ...state, isFetching: false };

    case MessageActionTypes.FETCH_ALL_SUCCESS: {
      const { payload } = action;

      const isChanged =
        state.isChanged != null &&
        (state.isChanged ||
          state.feedMessages.length !== payload.feedMessages.length ||
          state.interactions.length !== payload.interactions.length);

      return {
        ...state,
        isChanged,
        isFetching: false,
        feedMessages: [...payload.feedMessages].sort(sortByDate).reverse(),
        interactions: [...payload.interactions].sort(sortByDate).reverse(),
      };
    }

    case MessageActionTypes.FETCH_FEED_MESSAGES_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        isChanged: state.feedMessages.length !== payload.length,
        feedMessages: [...payload].sort(sortByDate).reverse(),
      };
    }

    case MessageActionTypes.FETCH_INTERACTIONS_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        isChanged: state.interactions.length !== payload.length,
        interactions: [...payload].sort(sortByDate).reverse(),
      };
    }

    case MessageActionTypes.CLEAR_NOTIFICATION:
      return {
        ...state,
        isChanged: false,
      };
    case MessageActionTypes.DELETE_REQUESTED:
      return { ...state, isDeleting: true, isRequesting: true };

    case MessageActionTypes.DELETE_FAILURE:
      return { ...state, isDeleting: true, isRequesting: false };

    case MessageActionTypes.DELETE_SUCCESS: {
      const { payload } = action;
      return updateAndExclude(state, payload, {
        isDeleting: true,
        isRequesting: false,
      });
    }

    case MessageActionTypes.CANCEL_REQUESTED:
      return { ...state, isRequesting: true };

    case MessageActionTypes.CANCEL_FAILURE:
      return { ...state, isRequesting: false };

    case MessageActionTypes.CANCEL_SUCCESS: {
      const { payload } = action;
      return updateAndExclude(state, payload.cancelledId, {
        isRequesting: false,
      });
    }

    case MessageActionTypes.REJECT_REQUESTED:
      return { ...state, isRequesting: true };

    case MessageActionTypes.REJECT_FAILURE:
      return { ...state, isRequesting: false };

    case MessageActionTypes.REJECT_SUCCESS: {
      const { payload } = action;
      return updateAndExclude(state, payload.invitationId, {
        isRequesting: false,
      });
    }

    case StoryletActionTypes.BEGIN_SOCIAL_EVENT_REQUESTED:
    case StoryletActionTypes.FETCH_AVAILABLE_REQUESTED:
      return { ...state, isRequesting: true };

    case StoryletActionTypes.BEGIN_SOCIAL_EVENT_SUCCESS:
    case StoryletActionTypes.BEGIN_SOCIAL_EVENT_FAILURE:
    case StoryletActionTypes.FETCH_AVAILABLE_SUCCESS:
    case StoryletActionTypes.FETCH_AVAILABLE_FAILURE:
      return { ...state, isRequesting: false };

    case StoryletActionTypes.BEGIN_SOCIAL_EVENT_UNAVAILABLE: {
      const { payload } = action;
      return {
        ...state,
        dialogMessage: payload.message,
        isRequesting: false,
        dialogOpen: true,
      };
    }

    case MessageActionTypes.CLOSE_DIALOG:
      return {
        ...state,
        dialogOpen: false,
        dialogMessage: null,
      };

    case MessageActionTypes.ACCEPT_REQUESTED:
      return { ...state, isRequesting: true };

    case MessageActionTypes.ACCEPT_FAILURE:
      return { ...state, isRequesting: false };

    case MessageActionTypes.ACCEPT_SUCCESS: {
      return acceptSuccess(state, action);
    }

    default:
      return state;
  }
}
