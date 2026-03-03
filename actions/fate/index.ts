import { ActionCreator } from "redux";

import { ProcessFateChange } from "actions/app/processFateChange";
import { FetchFateActions } from "actions/fate/fetch";
import { PurchaseItemActions } from "actions/fate/purchaseItem";

import { SET_ACTIVE_SUBTAB, TOGGLE_ENHANCED_STORE } from "actiontypes/fate";

import { FateSubtab } from "types/fate";

export { default as fetch } from "actions/fate/fetch";
export { default as purchaseItem } from "actions/fate/purchaseItem";

type SetFateSubtab = {
  type: typeof SET_ACTIVE_SUBTAB;
  payload: {
    subtab: FateSubtab;
  };
};

type ToggleEnhancedStoreView = {
  type: typeof TOGGLE_ENHANCED_STORE;
};

export type FateActions =
  | FetchFateActions
  | ProcessFateChange
  | PurchaseItemActions
  | SetFateSubtab
  | ToggleEnhancedStoreView;

export const setFateSubtab: ActionCreator<SetFateSubtab> = (
  subtab: FateSubtab
) => ({
  type: SET_ACTIVE_SUBTAB,
  payload: {
    subtab,
  },
});

export const toggleEnhancedStoreView: ActionCreator<
  ToggleEnhancedStoreView
> = () => ({
  type: TOGGLE_ENHANCED_STORE,
});
