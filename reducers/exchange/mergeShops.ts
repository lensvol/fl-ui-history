import { IExchangeState } from 'types/exchange';

export default function mergeShops(state: IExchangeState, payload: { exchange: { shops: {id: number | null }[] }}) {
  return {
    ...state.shops,
    ...payload.exchange.shops.reduce((acc, shop) => ({
      ...acc,
      [`${shop.id}`]: { items: [], ...shop },
    }), {}),
  };
}