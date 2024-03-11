import { FateActions } from "actions/fate";

import * as FateActionTypes from "actiontypes/fate";

import fetchSuccess from "reducers/fate/fetchSuccess";
import processFateChange from "reducers/fate/processFateChange";
import purchaseItemSuccess from "reducers/fate/purchaseItemSuccess";

import { FateData, FateSubtab, SUBTAB_GAMEPLAY } from "types/fate";

export interface IFateState {
  activePurchase: any | null;
  activeSubtab: FateSubtab;
  avatarSelected: any | null;
  hasFetched: boolean;
  isDialogOpen: boolean;
  isExceptionalFriend: boolean;
  isFetching: boolean;
  isPurchasing: boolean;
  message: string | null;
  premiumSubExpiryDateTime: string;
  purchaseComplete: boolean;
  data: FateData;
  showEnhancedStore: boolean;
  remainingStoryUnlocks?: number;
}

const INITIAL_STATE: IFateState = {
  activePurchase: null,
  activeSubtab: SUBTAB_GAMEPLAY,
  hasFetched: false,
  isExceptionalFriend: false,
  isFetching: true,
  isPurchasing: false,
  premiumSubExpiryDateTime: "0001-01-01T00:00:00", // this is the default value for non-EFs
  purchaseComplete: false,
  data: {
    actionRefillFateCard: undefined,
    enhancedActionRefreshCard: undefined,
    currentFate: 0,
    fateCards: [],
    premiumSubPurchaseCard: undefined,
  },
  isDialogOpen: false,
  message: null,
  avatarSelected: null,
  showEnhancedStore: false,
};

export default function fateReducer(
  state = INITIAL_STATE,
  action: FateActions
): IFateState {
  switch (action.type) {
    case FateActionTypes.PROCESS_FATE_CHANGE:
      return processFateChange(state, action);

    case FateActionTypes.FETCH_REQUESTED:
      return {
        ...state,
        isFetching: true,
        purchaseComplete: false,
      };

    case FateActionTypes.FETCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        purchaseComplete: false,
      };

    case FateActionTypes.FETCH_SUCCESS:
      return fetchSuccess(state, action);

    case FateActionTypes.PURCHASE_ITEM_REQUESTED:
      return {
        ...state,
        isPurchasing: true,
        purchaseComplete: false,
      };

    case FateActionTypes.PURCHASE_ITEM_SUCCESS:
      return purchaseItemSuccess(state, action);

    case FateActionTypes.PURCHASE_ITEM_FAILURE:
      return {
        ...state,
        isPurchasing: false,
      };

    case FateActionTypes.OPEN_PURCHASE_DIALOG:
      return {
        ...state,
        activePurchase: action.payload.item,
        isDialogOpen: true,
      };

    case FateActionTypes.CLOSE_PURCHASE_DIALOG:
      return {
        ...state,
        activePurchase: null,
        isDialogOpen: false,
        purchaseComplete: false,
        avatarSelected: null,
        isPurchasing: false,
      };

    case FateActionTypes.SET_ACTIVE_SUBTAB:
      return {
        ...state,
        activeSubtab: action.payload.subtab,
      };

    case FateActionTypes.TOGGLE_ENHANCED_STORE:
      return {
        ...state,
        showEnhancedStore: !state.showEnhancedStore,
      };

    default:
      return state;
  }
}
