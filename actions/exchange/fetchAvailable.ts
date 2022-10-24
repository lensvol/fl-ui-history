import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_AVAILABLE_FAILURE,
  FETCH_AVAILABLE_REQUESTED,
  FETCH_AVAILABLE_SUCCESS,
} from "actiontypes/exchange";
import { ActionCreator } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Success } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";

import ExchangeService from "services/ExchangeService";
import { IFetchAvailableItemsResponse } from "types/exchange";

export type FetchAvailableItemsRequested = {
  type: typeof FETCH_AVAILABLE_REQUESTED;
  payload: { background: boolean };
};

export type FetchAvailableItemsFailure = {
  type: typeof FETCH_AVAILABLE_FAILURE;
};
export type FetchAvailableItemsSuccess = {
  type: typeof FETCH_AVAILABLE_SUCCESS;
  payload: {
    activeStore: null;
    id: number | "null";
    items: any;
  };
};

export type FetchAvailableItemsAction =
  | FetchAvailableItemsFailure
  | FetchAvailableItemsRequested
  | FetchAvailableItemsSuccess;

type FetchAvailableOptions = {
  background?: boolean;
};

const fetchAvailableItemsRequested: ActionCreator<
  FetchAvailableItemsRequested
> = (background: boolean) => ({
  type: FETCH_AVAILABLE_REQUESTED,
  payload: { background },
});

export const fetchAvailableItemsSuccess: ActionCreator<
  FetchAvailableItemsSuccess
> = (data: IFetchAvailableItemsResponse, shopId: number | "null") => ({
  type: FETCH_AVAILABLE_SUCCESS,
  isFetchingAvailable: false,
  payload: {
    activeStore: null,
    id: shopId,
    items: data,
  },
});

const fetchAvailableItemsFailure: ActionCreator<FetchAvailableItemsFailure> = (
  error?: any
) => ({
  type: FETCH_AVAILABLE_FAILURE,
  isFetchingAvailable: false,
  error: true,
  status: error?.response?.status,
});

const exchangeService = new ExchangeService();

const fetchAvailableItems =
  (shopId: number | "null", options?: FetchAvailableOptions) =>
  async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(fetchAvailableItemsRequested(options?.background ?? false));

    try {
      const result = await exchangeService.fetchAvailableItems(shopId);
      if (result instanceof Success) {
        const { data } = result;
        // TODO(sdob): populate Redux store without forcing a UI update
        dispatch(fetchAvailableItemsSuccess(data, shopId));
      }
      return result;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
        return e;
      }
      dispatch(fetchAvailableItemsFailure(e));
      throw e;
    }
  };

export default fetchAvailableItems;
