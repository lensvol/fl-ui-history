import { ActionCreator } from "redux";

import { ProcessFateChange } from "actions/app/processFateChange";
import { ChangeAvatarActions } from "actions/fate/changeAvatar";
import { FetchFateActions } from "actions/fate/fetch";
import { PurchaseItemActions } from "actions/fate/purchaseItem";

import * as FateActionTypes from "actiontypes/fate";

import { FateSubtab } from "types/fate";

export {
  default as changeAvatar,
  changeAvatarSuccess,
} from "actions/fate/changeAvatar";
export { default as fetch } from "actions/fate/fetch";
export {
  default as purchaseItem,
  purchaseItemSuccess,
} from "actions/fate/purchaseItem";

export type ClosePurchaseDialog = {
  type: typeof FateActionTypes.CLOSE_PURCHASE_DIALOG;
};

export type OpenPurchaseDialog = {
  type: typeof FateActionTypes.OPEN_PURCHASE_DIALOG;
  payload: {
    item: any;
  };
};

export type PurchaseDialogActions = OpenPurchaseDialog | ClosePurchaseDialog;

export type SetFateSubtab = {
  type: typeof FateActionTypes.SET_ACTIVE_SUBTAB;
  payload: {
    subtab: FateSubtab;
  };
};

export type ToggleEnhancedStoreView = {
  type: typeof FateActionTypes.TOGGLE_ENHANCED_STORE;
};

export type FateActions =
  | ChangeAvatarActions
  | FetchFateActions
  | ProcessFateChange
  | PurchaseDialogActions
  | PurchaseItemActions
  | SetFateSubtab
  | ToggleEnhancedStoreView;

/** ----------------------------------------------------------------------------
 * PURCHASE DIALOG
 -----------------------------------------------------------------------------*/
export const openPurchaseDialog: ActionCreator<OpenPurchaseDialog> = (
  item: any
) => ({
  type: FateActionTypes.OPEN_PURCHASE_DIALOG,
  isDialogOpen: true,
  payload: {
    item,
  },
});

export const closePurchaseDialog: ActionCreator<ClosePurchaseDialog> = () => ({
  type: FateActionTypes.CLOSE_PURCHASE_DIALOG,
  hasCompletedInteraction: false,
  isDialogOpen: false,
});

export const setFateSubtab: ActionCreator<SetFateSubtab> = (
  subtab: FateSubtab
) => ({
  type: FateActionTypes.SET_ACTIVE_SUBTAB,
  payload: {
    subtab,
  },
});

export const toggleEnhancedStoreView: ActionCreator<
  ToggleEnhancedStoreView
> = () => ({
  type: FateActionTypes.TOGGLE_ENHANCED_STORE,
});
