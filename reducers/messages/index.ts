import { MessagesAction } from "actions/messages";
import { StoryletActions } from "actions/storylet";

import {
  ACCEPT_FAILURE,
  ACCEPT_REQUESTED,
  ACCEPT_SUCCESS,
  CANCEL_FAILURE,
  CANCEL_REQUESTED,
  CANCEL_SUCCESS,
  CLEAR_CACHE,
  CLEAR_NOTIFICATION,
  CLOSE_DIALOG,
  DELETE_FAILURE,
  DELETE_REQUESTED,
  DELETE_SUCCESS,
  EMAIL_FAILURE,
  EMAIL_REQUESTED,
  EMAIL_SUCCESS,
  FETCH_ALL_FAILURE,
  FETCH_ALL_REQUESTED,
  FETCH_ALL_SUCCESS,
  FETCH_INTERACTIONS_SUCCESS,
  REJECT_FAILURE,
  REJECT_REQUESTED,
  REJECT_SUCCESS,
} from "actiontypes/messages";
import {
  BEGIN_SOCIAL_EVENT_FAILURE,
  BEGIN_SOCIAL_EVENT_REQUESTED,
  BEGIN_SOCIAL_EVENT_SUCCESS,
  BEGIN_SOCIAL_EVENT_UNAVAILABLE,
  FETCH_AVAILABLE_FAILURE,
  FETCH_AVAILABLE_REQUESTED,
  FETCH_AVAILABLE_SUCCESS,
  GOBACK_SUCCESS,
} from "actiontypes/storylet";

import acceptSuccess from "reducers/messages/acceptSuccess";
import sortByDate from "reducers/messages/sortByDate";
import updateAndExclude from "reducers/messages/updateAndExclude";

import { IMessagesState } from "types/messages";

/**
 * Initial state
 * @type {Object}
 */
const INITIAL_STATE: IMessagesState = {
  dialogHeader: undefined,
  dialogMessage: undefined,
  dialogOpen: false,
  feedMessages: [],
  hasMessageTabAlert: undefined,
  interactions: [],
  invitationId: undefined,
  isAccepting: false,
  isCancelling: false,
  isDeleting: false,
  isFetching: false,
  isRequesting: false,
  subtab: "blah",
};

type MessageAction = MessagesAction | StoryletActions;

/**
 * Messages Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
export default function reducer(state = INITIAL_STATE, action: MessageAction) {
  switch (action.type) {
    case CLEAR_CACHE:
      return INITIAL_STATE;

    case FETCH_ALL_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };

    case FETCH_ALL_FAILURE:
    case GOBACK_SUCCESS:
      return {
        ...state,
        invitationId: undefined,
        isFetching: false,
      };

    case FETCH_ALL_SUCCESS: {
      const { payload } = action;

      const feedMessages = [...payload.feedMessages].sort(sortByDate).reverse();
      const interactions = [...payload.interactions].sort(sortByDate).reverse();

      const hasMessageTabAlert =
        state.hasMessageTabAlert !== undefined &&
        (state.hasMessageTabAlert ||
          state.feedMessages.length !== payload.feedMessages.length ||
          state.interactions.length !== payload.interactions.length);

      return {
        ...state,
        feedMessages,
        hasMessageTabAlert,
        interactions,
        invitationId: undefined,
        isFetching: false,
      };
    }

    case FETCH_INTERACTIONS_SUCCESS: {
      const { payload } = action;

      const interactions = [...payload].sort(sortByDate).reverse();

      return {
        ...state,
        hasMessageTabAlert: state.interactions.length !== payload.length,
        interactions,
        invitationId: undefined,
      };
    }

    case CLEAR_NOTIFICATION:
      return {
        ...state,
        hasMessageTabAlert: false,
      };

    case DELETE_REQUESTED:
      return {
        ...state,
        isDeleting: true,
        isRequesting: true,
      };

    case DELETE_FAILURE:
      return {
        ...state,
        isDeleting: true,
        isRequesting: false,
      };

    case DELETE_SUCCESS: {
      return updateAndExclude(state, action.payload, {
        isDeleting: true,
        isRequesting: false,
      });
    }

    case EMAIL_REQUESTED: {
      return {
        ...state,
        dialogOpen: false,
        isRequesting: true,
      };
    }

    case EMAIL_FAILURE: {
      return {
        ...state,
        dialogHeader: "An Error Occurred",
        dialogMessage: "Unable to send message.",
        dialogOpen: true,
        isRequesting: false,
      };
    }

    case EMAIL_SUCCESS: {
      return {
        ...state,
        dialogHeader: "Success!",
        dialogMessage: "Message has been sent to your account email.",
        dialogOpen: true,
        isRequesting: false,
      };
    }

    case ACCEPT_REQUESTED:
    case BEGIN_SOCIAL_EVENT_REQUESTED:
    case CANCEL_REQUESTED:
    case FETCH_AVAILABLE_REQUESTED:
    case REJECT_REQUESTED:
      return {
        ...state,
        isRequesting: true,
      };

    case ACCEPT_FAILURE:
    case BEGIN_SOCIAL_EVENT_FAILURE:
    case CANCEL_FAILURE:
    case FETCH_AVAILABLE_FAILURE:
    case FETCH_AVAILABLE_SUCCESS:
    case REJECT_FAILURE:
      return {
        ...state,
        isRequesting: false,
      };

    case CANCEL_SUCCESS: {
      return updateAndExclude(state, action.payload.cancelledId, {
        isRequesting: false,
      });
    }

    case REJECT_SUCCESS: {
      return updateAndExclude(state, action.payload.invitationId, {
        isRequesting: false,
      });
    }

    case BEGIN_SOCIAL_EVENT_SUCCESS: {
      return {
        ...state,
        invitationId: action.payload.invitationId,
        isRequesting: false,
      };
    }

    case BEGIN_SOCIAL_EVENT_UNAVAILABLE: {
      return {
        ...state,
        dialogMessage: action.payload.message,
        dialogOpen: true,
        isRequesting: false,
      };
    }

    case CLOSE_DIALOG:
      return {
        ...state,
        dialogMessage: null,
        dialogOpen: false,
      };

    case ACCEPT_SUCCESS: {
      return acceptSuccess(state, action);
    }

    default:
      return state;
  }
}
