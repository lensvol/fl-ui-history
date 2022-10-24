import { ActionCreator } from "redux";
import { ITransactionResponse } from "types/exchange";
import {
  SELL_ITEMS_FAILURE,
  SELL_ITEMS_REQUESTED,
  SELL_ITEMS_SUCCESS,
} from "actiontypes/exchange";

import makeTransaction from "./makeTransaction";

export type SellItemsRequested = { type: typeof SELL_ITEMS_REQUESTED };
export type SellItemsFailure = { type: typeof SELL_ITEMS_FAILURE };
export type SellItemsSuccess = {
  type: typeof SELL_ITEMS_SUCCESS;
  payload: ITransactionResponse;
};

/** ----------------------------------------------------------------------------
 * SELL ITEMS
 -----------------------------------------------------------------------------*/

export const sellItemsRequested: ActionCreator<SellItemsRequested> = () => ({
  type: SELL_ITEMS_REQUESTED,
});

export const sellItemsSuccess: ActionCreator<SellItemsSuccess> = (
  data: ITransactionResponse
) => ({
  type: SELL_ITEMS_SUCCESS,
  payload: data,
});

export const sellItemsFailure: ActionCreator<SellItemsFailure> = (
  error: any
) => ({
  type: SELL_ITEMS_FAILURE,
  error: true,
  status: error.response && error.response.status,
  stuff: error,
});

const sellItems = makeTransaction("sell", {
  failure: sellItemsFailure,
  requested: sellItemsRequested,
  success: sellItemsSuccess,
});
export default sellItems;
