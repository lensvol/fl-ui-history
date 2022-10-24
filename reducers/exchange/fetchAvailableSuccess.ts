import { FetchAvailableItemsSuccess } from "actions/exchange/fetchAvailable";
import mergeShopData from "./mergeShopData";
import { IExchangeState } from "types/exchange";

export default function fetchAvailableSuccess(
  state: IExchangeState,
  action: FetchAvailableItemsSuccess
) {
  return {
    ...state,
    isFetchingAvailable: false,
    shops: mergeShopData(state, action),
  };
}
