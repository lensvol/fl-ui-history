import { handleVersionMismatch } from "actions/versionSync";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import {
  SELECT_STORE_FAILURE,
  SELECT_STORE_REQUESTED,
  SELECT_STORE_SUCCESS,
} from "actiontypes/exchange";

import ExchangeService from "services/ExchangeService";
import { IAppState } from "types/app";
import { IFetchAvailableItemsResponse } from "types/exchange";

export type SelectStoreFailure = { type: typeof SELECT_STORE_FAILURE };
export type SelectStoreRequested = { type: typeof SELECT_STORE_REQUESTED };
export type SelectStoreSuccess = {
  type: typeof SELECT_STORE_SUCCESS;
  payload: {
    id: number | "null";
    items: IFetchAvailableItemsResponse;
  };
};

export type SelectStoreAction =
  | SelectStoreFailure
  | SelectStoreRequested
  | SelectStoreSuccess;

const service = new ExchangeService();

/** ----------------------------------------------------------------------------
 * SELECT STORE
 -----------------------------------------------------------------------------*/
export default function selectStore(shopId: number | "null") {
  return async (dispatch: Function, getState: () => IAppState) => {
    // Have we cached this store?
    const {
      exchange: { shops },
    } = getState();

    // If we have data in the cache, use it
    if (shops[shopId].items.length > 0) {
      return dispatch(selectStoreSuccess(shops[shopId].items, shopId));
    }

    // If not, then fetch the store data
    dispatch(selectStoreRequested());

    try {
      // const { data } = await service.fetchAvailableItems(shopId);
      const result = await service.fetchAvailableItems(shopId);
      if (result instanceof Success) {
        const { data } = result;
        dispatch(selectStoreSuccess(data, shopId));
      }
      return result;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
      }
      dispatch(selectStoreFailure(e));
    }
  };
}

const selectStoreRequested = () => ({ type: SELECT_STORE_REQUESTED });

const selectStoreSuccess = (
  items: IFetchAvailableItemsResponse,
  id: number | "null"
) => ({
  payload: { id, items },
  type: SELECT_STORE_SUCCESS,
});

const selectStoreFailure = (error?: any) => ({
  type: SELECT_STORE_FAILURE,
  error: true,
  status: error?.response?.status,
});
