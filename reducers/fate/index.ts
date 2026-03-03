import { FateActions } from "actions/fate";

import {
  FETCH_FAILURE,
  FETCH_REQUESTED,
  FETCH_SUCCESS,
  PROCESS_FATE_CHANGE,
  PURCHASE_ITEM_REQUESTED,
  PURCHASE_ITEM_SUCCESS,
  SET_ACTIVE_SUBTAB,
  TOGGLE_ENHANCED_STORE,
} from "actiontypes/fate";

import fetchSuccess from "reducers/fate/fetchSuccess";
import processFateChange from "reducers/fate/processFateChange";
import purchaseItemSuccess from "reducers/fate/purchaseItemSuccess";

import { FateData, FateSubtab, SUBTAB_NEW } from "types/fate";

export interface IFateState {
  activePurchase: any | null;
  activeSubtab: FateSubtab;
  data: FateData;
  hasFetched: boolean;
  isExceptionalFriend: boolean;
  isFetching: boolean;
  message: string | null;
  premiumSubExpiryDateTime: string;
  purchaseComplete: boolean;
  remainingStoryUnlocks?: number;
  showEnhancedStore: boolean;
}

const INITIAL_STATE: IFateState = {
  activePurchase: null,
  activeSubtab: SUBTAB_NEW,
  hasFetched: false,
  isExceptionalFriend: false,
  isFetching: true,
  premiumSubExpiryDateTime: "0001-01-01T00:00:00", // this is the default value for non-EFs
  purchaseComplete: false,
  data: {
    actionRefillFateCard: undefined,
    enhancedActionRefreshCard: undefined,
    currentFate: 0,
    fateCards: [],
    premiumSubPurchaseCard: undefined,
  },
  message: null,
  showEnhancedStore: false,
};

export default function fateReducer(
  state = INITIAL_STATE,
  action: FateActions
): IFateState {
  switch (action.type) {
    case PROCESS_FATE_CHANGE:
      return processFateChange(state, action);

    case FETCH_REQUESTED:
      return {
        ...state,
        isFetching: true,
        purchaseComplete: false,
      };

    case FETCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        purchaseComplete: false,
      };

    case FETCH_SUCCESS:
      return fetchSuccess(state, action);

    case PURCHASE_ITEM_REQUESTED:
      return {
        ...state,
        purchaseComplete: false,
      };

    case PURCHASE_ITEM_SUCCESS:
      return purchaseItemSuccess(state, action);

    case SET_ACTIVE_SUBTAB:
      return {
        ...state,
        activeSubtab: action.payload.subtab,
      };

    case TOGGLE_ENHANCED_STORE:
      return {
        ...state,
        showEnhancedStore: !state.showEnhancedStore,
      };

    default:
      return state;
  }
}
