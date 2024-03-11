import { ExchangeActions } from "actions/exchange";
import { SetCurrentSetting } from "actions/map/setCurrentSetting";

import * as ExchangeActionTypes from "actiontypes/exchange";
import * as MapActionTypes from "actiontypes/map";

import fetchAvailableSuccess from "reducers/exchange/fetchAvailableSuccess";
import fetchExchangeSuccess from "reducers/exchange/fetchExchangeSuccess";
import mergeShopData from "reducers/exchange/mergeShopData";
import updateShopItems from "reducers/exchange/updateShopItems";

import { IExchangeState } from "types/exchange";

/**
 * Initial state
 * @type {Object}
 */
const INITIAL_STATE: IExchangeState = {
  activeStore: "null",
  description: "",
  isAvailable: true,
  isFetching: false,
  isFetchingAvailable: false,
  data: {
    shops: [],
  },
  isFetchingSellItem: false,
  shops: {
    null: {
      id: null,
      name: "Sell my things",
      items: [],
    },
  },
  title: "",
};

/**
 * Exchange Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
const Exchange = (
  state = INITIAL_STATE,
  action: ExchangeActions | SetCurrentSetting
) => {
  switch (action.type) {
    case ExchangeActionTypes.FETCH_EXCHANGE_REQUESTED:
      return {
        ...state,
        isFetching: true,
      };

    case ExchangeActionTypes.FETCH_EXCHANGE_FAILURE:
      return {
        ...state,
        isAvailable: false,
        isFetching: false,
      };

    case ExchangeActionTypes.FETCH_EXCHANGE_SUCCESS:
      return fetchExchangeSuccess(state, action.payload);

    case ExchangeActionTypes.FETCH_AVAILABLE_REQUESTED:
      return {
        ...state,
        isFetchingAvailable: !action.payload.background,
      };

    case ExchangeActionTypes.FETCH_AVAILABLE_FAILURE:
      return {
        ...state,
        isFetchingAvailable: false,
      };

    case ExchangeActionTypes.FETCH_AVAILABLE_SUCCESS:
      return fetchAvailableSuccess(state, action);

    case ExchangeActionTypes.SELECT_STORE_REQUESTED:
      return {
        ...state,
        isFetchingAvailable: true,
      };

    case ExchangeActionTypes.SELECT_STORE_FAILURE:
      return {
        ...state,
        isFetchingAvailable: false,
      };

    case ExchangeActionTypes.SELECT_STORE_SUCCESS:
      return {
        ...state,
        activeStore: action.payload.id,
        isFetchingAvailable: false,
        shops: mergeShopData(state, action),
      };

    case ExchangeActionTypes.SELL_ITEMS_REQUESTED:
    case ExchangeActionTypes.BUY_ITEMS_REQUESTED:
      return {
        ...state,
        isFetchingSellItem: true,
      };

    case ExchangeActionTypes.SELL_ITEMS_FAILURE:
    case ExchangeActionTypes.BUY_ITEMS_FAILURE:
      return {
        ...state,
        isFetchingSellItem: false,
      };

    case ExchangeActionTypes.SELL_ITEMS_SUCCESS:
    case ExchangeActionTypes.BUY_ITEMS_SUCCESS:
      return {
        ...state,
        isFetchingSellItem: false,
        shops: updateShopItems(state, action),
      };

    case MapActionTypes.SET_CURRENT_SETTING:
      // Reset shop data entirely when we change Setting
      return {
        ...INITIAL_STATE,
      };

    default:
      return state;
  }
};

export default Exchange;
