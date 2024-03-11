import {
  FETCH_MYSELF_REQUESTED,
  FETCH_MYSELF_SUCCESS,
  MYSELF_CHANGED,
  NAME_CHANGED,
  CHOOSE_NEW_MANTELPIECE_SUCCESS,
  CHOOSE_NEW_SCRAPBOOK_SUCCESS,
  RENAME_OUTFIT_SUCCESS,
  NEW_AVATAR_IMAGE,
  SET_JOURNAL_PRIVACY_SUCCESS,
  SET_JOURNAL_PRIVACY_REQUESTED,
  SET_CAN_CHANGE_OUTFIT,
  CHANGE_OUTFIT_REQUESTED,
} from "actiontypes/myself";

import {
  SetJournalPrivacyRequested,
  SetJournalPrivacySuccess,
} from "actions/myself/setJournalPrivacy";
import { TransactionAction } from "actions/exchange/makeTransaction";
import { MyselfActions } from "actions/myself";
import { OutfitActions } from "actions/outfit";
import { ChooseBranchSuccessAction } from "actions/storylet/chooseBranch/chooseBranchSuccess";

import { BUY_ITEMS_SUCCESS, SELL_ITEMS_SUCCESS } from "actiontypes/exchange";
import { CHOOSE_BRANCH_SUCCESS } from "actiontypes/storylet";
import changeOutfitRequested from "reducers/myself/changeOutfitRequested";
import renameOutfitSuccess from "reducers/myself/renameOutfitSuccess";

import { IMyselfState } from "types/myself";
import chooseNewDisplayQualitySuccess from "./chooseNewDisplayQualitySuccess";
import exchangeTransactionSuccess from "./exchangeTransactionSuccess";
import fetchMyselfSuccess from "./fetchMyselfSuccess";
import myselfChanged from "./myselfChanged";
import nameChanged from "./nameChanged";

// This is the expected state structure; we're explicitly setting
// things as undefined so that we have a record of how we expect it to look
const INITIAL_STATE: IMyselfState = {
  categories: [],
  character: {
    avatarImage: "beardy",
    currentDomicile: {
      description: undefined,
      image: undefined,
      maxHandSize: undefined,
      name: undefined,
    },
    description: undefined,
    descriptiveText: undefined,
    id: undefined,
    journalIsPrivate: false,
    mantelpieceItemId: undefined,
    name: "Someone",
    outfits: [],
    scrapbookStatusId: undefined,
    setting: undefined,
  },
  hasFetched: false, // Set to true when we fetch successfully
  isFetching: false,
  isRequestingItemUse: false,
  qualities: [],
};

export default function reducer(
  state = INITIAL_STATE,
  action:
    | MyselfActions
    | OutfitActions
    | TransactionAction
    | ChooseBranchSuccessAction
): IMyselfState {
  switch (action.type) {
    case FETCH_MYSELF_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };

    case FETCH_MYSELF_SUCCESS:
      return fetchMyselfSuccess(state, action.payload);

    case MYSELF_CHANGED:
      return myselfChanged(state, action);

    case NAME_CHANGED:
      return nameChanged(state, action.payload);

    case BUY_ITEMS_SUCCESS:
    case SELL_ITEMS_SUCCESS:
      return exchangeTransactionSuccess(state, action.payload);

    case CHOOSE_NEW_MANTELPIECE_SUCCESS:
      return chooseNewDisplayQualitySuccess(state, action, "mantelpieceItemId");

    case CHOOSE_NEW_SCRAPBOOK_SUCCESS:
      return chooseNewDisplayQualitySuccess(state, action, "scrapbookStatusId");

    case RENAME_OUTFIT_SUCCESS:
      return renameOutfitSuccess(state, action.payload);

    case NEW_AVATAR_IMAGE:
      return {
        ...state,
        character: {
          ...state.character,
          avatarImage: action.payload.avatarImage,
        },
      };

    // Optimistically change which outfit is selected
    case CHANGE_OUTFIT_REQUESTED:
      return changeOutfitRequested(state, action);

    case SET_CAN_CHANGE_OUTFIT:
      return {
        ...state,
        character: {
          ...state.character,
        },
      };

    case SET_JOURNAL_PRIVACY_REQUESTED: {
      // Optimistically update the UI
      return {
        ...state,
        character: {
          ...state.character,
          journalIsPrivate: (action as SetJournalPrivacyRequested).payload
            .journalIsPrivate,
        },
      };
    }

    case SET_JOURNAL_PRIVACY_SUCCESS: {
      return {
        ...state,
        character: {
          ...state.character,
          journalIsPrivate: (action as SetJournalPrivacySuccess).payload
            .journalIsPrivate,
        },
      };
    }

    case CHOOSE_BRANCH_SUCCESS: {
      const { setting } = (action as ChooseBranchSuccessAction).payload;

      if (!setting) {
        return state;
      }

      return {
        ...state,
        character: {
          ...state.character,
          setting,
        },
      };
    }

    default:
      return state;
  }
}
