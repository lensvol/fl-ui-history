import { ProcessFateChange } from "actions/app/processFateChange";
import { FetchFateActions } from "actions/fate/fetch";
import { PurchaseItemActions } from "actions/fate/purchaseItem";
import * as FateActionTypes from "actiontypes/fate";
import { ActionCreator } from "redux";
import { FateSubtab } from "types/fate";
import { ChangeAvatarActions } from "./changeAvatar";

export { default as changeAvatar, changeAvatarSuccess } from "./changeAvatar";

export { default as fetch } from "./fetch";
export { default as purchaseItem, purchaseItemSuccess } from "./purchaseItem";

export type ClosePurchaseDialog = {
  type: typeof FateActionTypes.CLOSE_PURCHASE_DIALOG;
};
export type OpenPurchaseDialog = {
  type: typeof FateActionTypes.OPEN_PURCHASE_DIALOG;
  payload: { item: any };
};
export type PurchaseDialogActions = OpenPurchaseDialog | ClosePurchaseDialog;

export type SetFateSubtab = {
  type: typeof FateActionTypes.SET_ACTIVE_SUBTAB;
  payload: { subtab: FateSubtab };
};

export type FateActions =
  | ChangeAvatarActions
  | FetchFateActions
  | ProcessFateChange
  | PurchaseDialogActions
  | PurchaseItemActions
  | SetFateSubtab;

/** ----------------------------------------------------------------------------
 * PURCHASE DIALOG
 -----------------------------------------------------------------------------*/
export const openPurchaseDialog: ActionCreator<OpenPurchaseDialog> = (
  item: any
) => ({
  type: FateActionTypes.OPEN_PURCHASE_DIALOG,
  payload: { item },
  isDialogOpen: true,
});

export const closePurchaseDialog: ActionCreator<ClosePurchaseDialog> = () => ({
  type: FateActionTypes.CLOSE_PURCHASE_DIALOG,
  isDialogOpen: false,
  hasCompletedInteraction: false,
});

export const setFateSubtab: ActionCreator<SetFateSubtab> = (
  subtab: FateSubtab
) => ({
  type: FateActionTypes.SET_ACTIVE_SUBTAB,
  payload: { subtab },
});
