import { ActionCreator } from "redux";
import { ITransactionResponse } from "types/exchange";
import {
  BUY_ITEMS_FAILURE,
  BUY_ITEMS_REQUESTED,
  BUY_ITEMS_SUCCESS,
} from "actiontypes/exchange";

import makeTransaction from "./makeTransaction";

export type BuyItemsFailure = { type: typeof BUY_ITEMS_FAILURE };
export type BuyItemsRequested = { type: typeof BUY_ITEMS_REQUESTED };
export type BuyItemsSuccess = {
  type: typeof BUY_ITEMS_SUCCESS;
  payload: ITransactionResponse;
};

/** ----------------------------------------------------------------------------
 * BUY ITEMS
 -----------------------------------------------------------------------------*/

export const buyItemsRequested: ActionCreator<BuyItemsRequested> = () => ({
  type: BUY_ITEMS_REQUESTED,
});

export const buyItemsSuccess: ActionCreator<BuyItemsSuccess> = (
  data: ITransactionResponse
) => ({
  type: BUY_ITEMS_SUCCESS,
  payload: data,
});

export const buyItemsFailure: ActionCreator<BuyItemsFailure> = (
  error?: any
) => ({
  type: BUY_ITEMS_FAILURE,
  error: true,
  status: error?.response?.status,
});

const buyItems = makeTransaction("buy", {
  failure: buyItemsFailure,
  requested: buyItemsRequested,
  success: buyItemsSuccess,
});
export default buyItems;
