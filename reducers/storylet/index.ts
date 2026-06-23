import { StoryletActions } from "actions/storylet";
import { AddNewContactSuccessAction } from "actions/storylet/addNewContact";
import { BeginSuccessAction } from "actions/storylet/begin";
import { BeginSocialEventSuccessAction } from "actions/storylet/beginSocialEvent";
import { FetchAvailableSuccessAction } from "actions/storylet/fetchAvailable";
import { GoBackFromSocialActAction } from "actions/storylet/goBackFromSocialAct";
import { RenameQualitySuccessAction } from "actions/storylet/renameQuality";

import {
  ADD_NEW_CONTACT_FAILURE,
  ADD_NEW_CONTACT_REQUESTED,
  ADD_NEW_CONTACT_SUCCESS,
  BEGIN_SOCIAL_EVENT_FAILURE,
  BEGIN_SOCIAL_EVENT_REQUESTED,
  BEGIN_SOCIAL_EVENT_SUCCESS,
  CANNOT_USE_QUALITY,
  CHOOSE_BRANCH_FAILURE,
  CHOOSE_BRANCH_REQUESTED,
  CHOOSE_BRANCH_SUCCESS,
  CHOOSE_STORYLET_FAILURE,
  CHOOSE_STORYLET_REQUESTED,
  CHOOSE_STORYLET_SUCCESS,
  CLEAR_CACHE,
  CREATE_PLAN_FAILURE,
  FETCH_AVAILABLE_FAILURE,
  FETCH_AVAILABLE_IN_BACKGROUND_REQUESTED,
  FETCH_AVAILABLE_REQUESTED,
  FETCH_AVAILABLE_SUCCESS,
  FETCH_INELIGIBLE_CONTACTS_SUCCESS,
  GO_BACK_FROM_SOCIAL_ACT,
  GOBACK_FAILURE,
  GOBACK_REQUESTED,
  GOBACK_SUCCESS,
  PUT_IN,
  RENAME_QUALITY_FAILURE,
  RENAME_QUALITY_REQUESTED,
  RENAME_QUALITY_SUCCESS,
  RESET_MAP_UPDATED,
  SEND_SOCIAL_INVITATION_FAILURE,
  SEND_SOCIAL_INVITATION_REQUESTED,
  SEND_SOCIAL_INVITATION_SUCCESS,
} from "actiontypes/storylet";

import chooseBranchSuccess from "reducers/storylet/chooseBranchSuccess";
import clearCache from "reducers/storylet/clearCache";
import fetchAvailableSuccess from "reducers/storylet/fetchAvailableSuccess";
import renameQualitySuccess from "reducers/storylet/renameQualitySuccess";
import sortEligibleFriends from "reducers/storylet/sortEligibleFriends";

import { IStoryletState } from "types/storylet";

export const INITIAL_STATE: IStoryletState = {
  addedFriendId: 0,
  canChangeOutfit: false,
  isChoosing: false,
  isFetching: false,
  isGoingBack: false,
  isSaving: false,
  isRenaming: false,
  phase: "Available",
  endStorylet: undefined,
  dated: false,
  message: null,
  messages: undefined,
  storylets: [],
  storylet: null,
  socialAct: null,
  rename: null,
  eligibleFriends: null,
  ineligibleContacts: [],
  secondChance: null,
};

/**
 * Storylet
 * @param {Object} state
 * @param {[Object]} action
 */
export default function reducer(
  state = INITIAL_STATE,
  action: StoryletActions
): IStoryletState {
  switch (action.type) {
    case CLEAR_CACHE:
      return clearCache(state);

    case CHOOSE_STORYLET_REQUESTED:
      return {
        ...state,
        isChoosing: true,
      };

    case CHOOSE_STORYLET_FAILURE:
      return {
        ...state,
        isChoosing: false,
      };

    case CHOOSE_STORYLET_SUCCESS: {
      const {
        payload: { canChangeOutfit, endStorylet, messages, phase, storylet },
      } = action as BeginSuccessAction;

      return {
        ...state,
        canChangeOutfit,
        endStorylet,
        isChoosing: false,
        messages,
        phase,
        storylet,
      };
    }

    case FETCH_AVAILABLE_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };

    // This is here to remind us that it's not omitted. If the app is doing
    // a background fetch of available storylets, then we shouldn't set
    // isFetching to true (the UI is being updated separately)
    case FETCH_AVAILABLE_IN_BACKGROUND_REQUESTED:
      return state;

    case FETCH_AVAILABLE_FAILURE:
      return {
        ...state,
        isFetching: false,
        // TODO: previously we set phase: action.phase, which will always
        // evaluate to undefined. I'm not sure what the implications are for this,
        // but we probably shouldn't clobber phase like that on a network failure
        // phase: action.phase
      };

    case FETCH_AVAILABLE_SUCCESS:
      return fetchAvailableSuccess(
        state,
        (action as FetchAvailableSuccessAction).payload
      );

    case GOBACK_REQUESTED:
      return {
        ...state,
        isGoingBack: true,
      };

    case GOBACK_FAILURE:
      return {
        ...state,
        isGoingBack: false,
        // TODO: action.phase will always evaluate to undefined on GOBACK_FAILURE.
        // Do we really want to set that?
        // phase: action.phase || state.phase,
      };

    case GOBACK_SUCCESS: {
      const { payload } = action;

      return {
        ...state,
        canChangeOutfit: payload.canChangeOutfit,
        isGoingBack: false,
        phase: payload.phase,
        storylet: null,
      };
    }

    case CHOOSE_BRANCH_REQUESTED:
      return {
        ...state,
        isChoosing: true,
      };

    case CHOOSE_BRANCH_FAILURE:
      return {
        ...state,
        isChoosing: false,
      };

    case CHOOSE_BRANCH_SUCCESS: {
      return chooseBranchSuccess(state, action);
    }

    case SEND_SOCIAL_INVITATION_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };

    case SEND_SOCIAL_INVITATION_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case SEND_SOCIAL_INVITATION_SUCCESS: {
      const { payload } = action;

      return {
        ...state,
        isFetching: false,
        phase: payload.phase,
        // TODO: WTF?
        storylet: payload.phase === "End" ? null : state.storylet,
        endStorylet: payload.endStorylet,
        messages: payload.messages,
      };
    }

    case FETCH_INELIGIBLE_CONTACTS_SUCCESS:
      return {
        ...state,
        ineligibleContacts: action.payload.ineligibleContacts,
      };

    case CREATE_PLAN_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case ADD_NEW_CONTACT_REQUESTED:
      return {
        ...state,
        isSaving: true,
      };

    case ADD_NEW_CONTACT_FAILURE:
      return {
        ...state,
        isSaving: false,
      };

    case ADD_NEW_CONTACT_SUCCESS: {
      const { payload } = action as AddNewContactSuccessAction;

      return {
        ...state,
        addedFriendId: payload.addedFriendId,
        eligibleFriends: [...(payload.eligibleFriends ?? [])].sort(
          sortEligibleFriends
        ),
        isSaving: false,
        message: payload.message,
      };
    }

    case RENAME_QUALITY_REQUESTED:
      return {
        ...state,
        isRenaming: true,
      };

    case RENAME_QUALITY_FAILURE:
      return {
        ...state,
        isRenaming: false,
      };

    case RENAME_QUALITY_SUCCESS: {
      const { payload } = action as RenameQualitySuccessAction;

      return renameQualitySuccess(state, payload);
    }

    case RESET_MAP_UPDATED:
      return state;

    case BEGIN_SOCIAL_EVENT_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };

    case BEGIN_SOCIAL_EVENT_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case BEGIN_SOCIAL_EVENT_SUCCESS: {
      const {
        payload: { messages, phase, storylet },
      } = action as BeginSocialEventSuccessAction;

      return {
        ...state,
        messages,
        phase,
        storylet,
        isFetching: false,
      };
    }

    case GO_BACK_FROM_SOCIAL_ACT:
      return {
        ...state,
        phase: (action as GoBackFromSocialActAction).payload.phase,
        socialAct: null,
      };

    case PUT_IN:
      return {
        ...state,
        phase: "In",
      };

    case CANNOT_USE_QUALITY:
      return state;

    default:
      return state;
  }
}
