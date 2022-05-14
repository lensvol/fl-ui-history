import mergeShops from './mergeShops';
import { IExchangeState, IFetchExchangeResponse } from 'types/exchange';

export default function fetchExchangeSuccess(state: IExchangeState, payload: IFetchExchangeResponse) {
  return {
    ...state,
    description: payload.exchange.description,
    isFetching: false,
    shops: mergeShops(state, payload),
    title: payload.exchange.title,
    isAvailable: true,
  };
}