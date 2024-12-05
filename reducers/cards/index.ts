import { CardsActions } from "actions/cards";
import { OutfitActions } from "actions/outfit";
import { BeginStoryletActions } from "actions/storylet/begin";
import { ChooseBranchAction } from "actions/storylet/chooseBranch";
import { FetchAvailableSuccessAction } from "actions/storylet/fetchAvailable";

import * as CardActionTypes from "actiontypes/cards";
import {
  EQUIP_QUALITY_SUCCESS,
  CHANGE_OUTFIT_SUCCESS,
} from "actiontypes/myself";
import {
  CHOOSE_BRANCH_SUCCESS,
  CHOOSE_STORYLET_FAILURE,
  CHOOSE_STORYLET_REQUESTED,
  CHOOSE_STORYLET_SUCCESS,
  FETCH_AVAILABLE_SUCCESS,
} from "actiontypes/storylet";

import formatPayload from "reducers/cards/formatPayload";
import reverseCards from "reducers/cards/reverseCards";

import { ICardsState } from "types/cards";

/**
 * Initial state
 */
const INITIAL_STATE: ICardsState = {
  cardsCount: 0,
  deckSize: 0,
  displayCards: [],
  handSize: 0,
  isDrawing: false,
  isFetchingInBackground: false,
  isFetching: false,
  isPlaying: false,
  shouldFetch: false,
  wasInvalidatedByEquipmentChange: false,
};

export default function reducer(
  state = INITIAL_STATE,
  action:
    | CardsActions
    | BeginStoryletActions
    | OutfitActions
    | ChooseBranchAction
    | FetchAvailableSuccessAction
): ICardsState {
  switch (action.type) {
    case CardActionTypes.CARDS_SHOULD_FETCH:
      return {
        ...state,
        shouldFetch: true,
      };

    case CardActionTypes.CLEAR_CACHE:
      // We are resetting the initial state, but we now have empty card data; we need to fetch cards
      return {
        ...INITIAL_STATE,
        shouldFetch: true,
      };

    case CardActionTypes.BACKGROUND_FETCH_CARDS_REQUESTED:
      return {
        ...state,
        isFetchingInBackground: true,
        shouldFetch: false,
      };

    case CardActionTypes.FETCH_CARDS_REQUESTED:
      return {
        ...state,
        isFetching: true,
        shouldFetch: false,
      };

    case CardActionTypes.FETCH_CARDS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFetchingInBackground: false,
        shouldFetch: false,
      };

    case CardActionTypes.FETCH_CARDS_SUCCESS: {
      const payload = formatPayload(action.payload);

      return {
        ...state,
        ...payload,
        cardsCount: action.payload.eligibleForCardsCount,
        deckSize: action.payload.maxDeckSize,
        handSize: action.payload.maxHandSize,
        displayCards: reverseCards(payload),
        isFetching: false,
        isFetchingInBackground: false,
        shouldFetch: false,
        wasInvalidatedByEquipmentChange: false,
      };
    }

    case CardActionTypes.DISCARD_CARDS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFetchingInBackground: false,
      };

    case CardActionTypes.DISCARD_CARDS_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };

    case CardActionTypes.DISCARD_CARDS_SUCCESS: {
      const payload = formatPayload(action.payload);

      return {
        ...state,
        ...payload,
        isFetching: false,
        displayCards: reverseCards(payload),
      };
    }

    case CardActionTypes.DRAW_CARDS_REQUESTED:
      return {
        ...state,
        isDrawing: true,
        isFetching: true,
      };

    case CardActionTypes.DRAW_CARDS_FAILURE:
      return {
        ...state,
        isDrawing: false,
        isFetching: false,
      };

    case CardActionTypes.DRAW_CARDS_SUCCESS: {
      const payload = formatPayload(action.payload);

      return {
        ...state,
        ...payload,
        isDrawing: false,
        isFetching: false,
        displayCards: reverseCards(payload),
      };
    }

    case CHOOSE_STORYLET_REQUESTED:
      return {
        ...state,
        isPlaying: true,
      };

    case CHOOSE_STORYLET_SUCCESS:
    case CHOOSE_BRANCH_SUCCESS:
    case FETCH_AVAILABLE_SUCCESS:
      return {
        ...state,
        isPlaying: false,
        handSize: action.payload.maxHandSize ?? state.handSize,
      };

    case CHOOSE_STORYLET_FAILURE:
      return {
        ...state,
        isPlaying: false,
      };

    case EQUIP_QUALITY_SUCCESS:
    case CHANGE_OUTFIT_SUCCESS:
      return {
        ...state,
        wasInvalidatedByEquipmentChange: true,
      };

    default:
      return state;
  }
}
