import { handleVersionMismatch } from 'actions/versionSync';
import { FETCH_EXCHANGE_FAILURE, FETCH_EXCHANGE_REQUESTED, FETCH_EXCHANGE_SUCCESS } from 'actiontypes/exchange';
import { ActionCreator } from 'redux';
import { Either, Success } from 'services/BaseMonadicService';
import { VersionMismatch } from 'services/BaseService';

import ExchangeService from 'services/ExchangeService';
import { IFetchExchangeResponse } from 'types/exchange';

const exchangeService = new ExchangeService();

export type FetchExchangeRequested = {
  type: typeof FETCH_EXCHANGE_REQUESTED,
};

export type FetchExchangeSuccess = {
  type: typeof FETCH_EXCHANGE_SUCCESS,
  payload: IFetchExchangeResponse,
};

export type FetchExchangeFailure = { type: typeof FETCH_EXCHANGE_FAILURE };

export type FetchExchangeAction = FetchExchangeFailure | FetchExchangeRequested | FetchExchangeSuccess;

/** ----------------------------------------------------------------------------
 * FETCH EXCHANGE
 -----------------------------------------------------------------------------*/
export default function fetchExchange() {
  return async (dispatch: Function) => {
    dispatch(fetchExchangeRequested());

    try {
      const result: Either<IFetchExchangeResponse> = await exchangeService.fetchExchange();
      if (result instanceof Success) {
        const { data } = result;
        dispatch(fetchExchangeSuccess(data));
      } else {
        // The bazaar is unavailable
        dispatch(fetchExchangeFailure());
      }
      return result;
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
      }
      dispatch(fetchExchangeFailure(e));
    }
  };
}

export const fetchExchangeRequested: ActionCreator<FetchExchangeRequested> = () => ({
  type: FETCH_EXCHANGE_REQUESTED,
});

export const fetchExchangeSuccess: ActionCreator<FetchExchangeSuccess> = (data: IFetchExchangeResponse) => ({
  type: FETCH_EXCHANGE_SUCCESS,
  payload: data,
});

export const fetchExchangeFailure: ActionCreator<FetchExchangeFailure> = (error?: any) => ({
  type: FETCH_EXCHANGE_FAILURE,
  error: true,
  status: error?.response?.status,
});