import { StoryletActions } from 'actions/storylet';
import { AddNewContactSuccessAction } from 'actions/storylet/addNewContact';
import { BeginSuccessAction } from 'actions/storylet/begin';
import { BeginSocialEventSuccessAction } from 'actions/storylet/beginSocialEvent';
import { FetchAvailableSuccessAction } from 'actions/storylet/fetchAvailable';
import { GoBackFromSocialActAction } from 'actions/storylet/goBackFromSocialAct';
import { RenameQualitySuccessAction } from 'actions/storylet/renameQuality';
import * as StoryletActionTypes from 'actiontypes/storylet';

import { IStoryletState } from 'types/storylet';

import chooseBranchSuccess from './chooseBranchSuccess';
import clearCache from './clearCache';
import fetchAvailableSuccess from './fetchAvailableSuccess';
import renameQualitySuccess from './renameQualitySuccess';
import sortEligibleFriends from './sortEligibleFriends';

export const INITIAL_STATE: IStoryletState = {
  addedFriendId: 0,
  canChangeOutfit: false,
  isChoosing: false,
  isFetching: false,
  isGoingBack: false,
  isSaving: false,
  isRenaming: false,
  phase: 'Available',
  endStorylet: undefined,
  dated: false,
  message: null,
  messages: undefined,
  storylets: [],
  storylet: null,
  socialAct: null,
  externalSocialAct: null,
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
export default function reducer(state = INITIAL_STATE, action: StoryletActions): IStoryletState {
  // const { payload = {} } = action;

  switch (action.type) {
    case StoryletActionTypes.CLEAR_CACHE:
      return clearCache(state);

    case StoryletActionTypes.CHOOSE_STORYLET_REQUESTED:
      return { ...state, isChoosing: true };

    case StoryletActionTypes.CHOOSE_STORYLET_FAILURE:
      return {
        ...state,
        isChoosing: false,
      };

    case StoryletActionTypes.CHOOSE_STORYLET_SUCCESS: {
      const {
        payload: {
          canChangeOutfit,
          endStorylet,
          messages,
          phase,
          storylet,
        },
      } = action as BeginSuccessAction;
      return {
        ...state,
        canChangeOutfit,
        phase,
        storylet,
        endStorylet,
        messages,
        isChoosing: false,
      };
    }

    case StoryletActionTypes.FETCH_AVAILABLE_REQUESTED:
      return { ...state, isFetching: true };

    // This is here to remind us that it's not omitted. If the app is doing
    // a background fetch of available storylets, then we shouldn't set
    // isFetching to true (the UI is being updated separately)
    case StoryletActionTypes.FETCH_AVAILABLE_IN_BACKGROUND_REQUESTED:
      return state;

    case StoryletActionTypes.FETCH_AVAILABLE_FAILURE:
      return {
        ...state,
        isFetching: false,
        // TODO: previously we set phase: action.phase, which will always
        // evaluate to undefined. I'm not sure what the implications are for this,
        // but we probably shouldn't clobber phase like that on a network failure
        // phase: action.phase
      };

    case StoryletActionTypes.FETCH_AVAILABLE_SUCCESS:
      return fetchAvailableSuccess(state, (action as FetchAvailableSuccessAction).payload);

    case StoryletActionTypes.GOBACK_REQUESTED:
      return { ...state, isGoingBack: true };

    case StoryletActionTypes.GOBACK_FAILURE:
      return {
        ...state,
        isGoingBack: false,
        // TODO: action.phase will always evaluate to undefined on GOBACK_FAILURE.
        // Do we really want to set that?
        // phase: action.phase || state.phase,
      };

    case StoryletActionTypes.GOBACK_SUCCESS: {
      const { payload } = action;
      return {
        ...state,
        isGoingBack: false,
        storylet: null,
        canChangeOutfit: payload.canChangeOutfit,
        phase: payload.phase,
      };
    }

    case StoryletActionTypes.CHOOSE_BRANCH_REQUESTED:
      return { ...state, isChoosing: true };

    case StoryletActionTypes.CHOOSE_BRANCH_FAILURE:
      return {
        ...state,
        isChoosing: false,
        // phase: action.phase,
      };

    case StoryletActionTypes.CHOOSE_BRANCH_SUCCESS: {
      return chooseBranchSuccess(state, action);
      // const { payload } = action as ChooseBranchSuccessAction;
      // return chooseBranchSuccess(state, payload);
    }

    case StoryletActionTypes.SEND_SOCIAL_INVITATION_REQUESTED:
      return { ...state, isFetching: true };

    case StoryletActionTypes.SEND_SOCIAL_INVITATION_FAILURE:
      return { ...state, isFetching: false };

    case StoryletActionTypes.SEND_SOCIAL_INVITATION_SUCCESS: {
      const { payload } = action;

      return {
        ...state,
        isFetching: false,
        phase: payload.phase,
        // TODO: WTF?
        storylet: payload.phase === 'End' ? null : state.storylet,
        endStorylet: payload.endStorylet,
        externalSocialAct: payload.externalSocialAct,
        messages: payload.messages,
      };
    }

    case StoryletActionTypes.FETCH_INELIGIBLE_CONTACTS_SUCCESS:
      return {
        ...state,
        ineligibleContacts: action.payload.ineligibleContacts,
      };

    case StoryletActionTypes.CREATE_PLAN_FAILURE:
      return { ...state, isFetching: false };

    case StoryletActionTypes.ADD_NEW_CONTACT_REQUESTED:
      return { ...state, isSaving: true };

    case StoryletActionTypes.ADD_NEW_CONTACT_FAILURE:
      return { ...state, isSaving: false };

    case StoryletActionTypes.ADD_NEW_CONTACT_SUCCESS: {
      const { payload } = action as AddNewContactSuccessAction;
      return {
        ...state,
        isSaving: false,
        message: payload.message,
        eligibleFriends: [...(payload.eligibleFriends ?? [])].sort(sortEligibleFriends),
        addedFriendId: payload.addedFriendId,
      };
    }

    case StoryletActionTypes.RENAME_QUALITY_REQUESTED:
      return { ...state, isRenaming: true };

    case StoryletActionTypes.RENAME_QUALITY_FAILURE:
      return { ...state, isRenaming: false };

    case StoryletActionTypes.RENAME_QUALITY_SUCCESS: {
      const { payload } = action as RenameQualitySuccessAction;
      return renameQualitySuccess(state, payload);
    }

    case StoryletActionTypes.RESET_MAP_UPDATED:
      return state;

    case StoryletActionTypes.BEGIN_SOCIAL_EVENT_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };

    case StoryletActionTypes.BEGIN_SOCIAL_EVENT_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    case StoryletActionTypes.BEGIN_SOCIAL_EVENT_SUCCESS: {
      const {
        payload: {
          messages,
          phase,
          storylet,
        },
      } = action as BeginSocialEventSuccessAction;

      return {
        ...state,
        messages,
        phase,
        storylet,
        isFetching: false,
      };
    }

    case StoryletActionTypes.GO_BACK_FROM_SOCIAL_ACT:
      return {
        ...state,
        phase: (action as GoBackFromSocialActAction).payload.phase,
        socialAct: null,
      };

    case StoryletActionTypes.PUT_IN:
      return { ...state, phase: 'In' };

    case StoryletActionTypes.CANNOT_USE_QUALITY:
      return state;

    default:
      return state;
  }
}

// export default Storylet;
