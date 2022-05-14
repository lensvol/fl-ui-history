import { FetchAvailableItemsSuccess } from 'actions/exchange/fetchAvailable';
import { SelectStoreSuccess } from 'actions/exchange/selectStore';
import { IExchangeState } from 'types/exchange';

export default function mergeShopData(
  state: IExchangeState,
  action: FetchAvailableItemsSuccess | SelectStoreSuccess,
) {
  const { id, items } = action.payload;
  return {
    ...state.shops,
    [id]: { ...state.shops[id], items },
  };
}