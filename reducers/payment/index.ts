import {
  CLOSE_DIALOG,
  OPEN_DIALOG,
  PURCHASE_FAILURE,
  PURCHASE_SUCCESS,
  SELECT_CURRENCY_FAILURE,
  SELECT_CURRENCY_REQUESTED,
  SELECT_CURRENCY_SUCCESS,
  SELECT_PACKAGE,
} from "actiontypes/payment";

import selectCurrencySuccess from "reducers/payment/selectCurrencySuccess";
import selectPackage from "reducers/payment/selectPackage";

import { IPaymentState } from "types/payment";

/**
 * Initial state
 * @type {Object}
 */
const INITIAL_STATE: IPaymentState = {
  braintreeConfig: undefined,
  clientRequestToken: undefined,
  currencies: {},
  currency: "",
  currencyCode: undefined,
  environmentPrefix: null,
  isFetching: false,
  isSuccess: false,
  message: undefined,
  packages: [],
  paymentType: null,
  selectedPackage: undefined,
};

export default function reducer(
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) {
  const { payload = {} } = action;

  switch (action.type) {
    case OPEN_DIALOG:
      return {
        ...state,
        isSuccess: false,
        message: null,
        paymentType: payload.paymentType,
      };

    case CLOSE_DIALOG:
      return {
        ...state,
        selectedPackage: null,
        isSuccess: false,
        message: null,
      };

    case SELECT_CURRENCY_REQUESTED:
      return {
        ...state,
        isFetching: true,
        currency: payload.currency,
        selectedPackage: null,
      };

    case SELECT_CURRENCY_SUCCESS:
      return selectCurrencySuccess(state, payload);

    case SELECT_CURRENCY_FAILURE:
      return {
        ...state,
        isFetching: false,
        currency: payload.currency,
      };

    case SELECT_PACKAGE:
      return selectPackage(state, payload);

    case PURCHASE_FAILURE:
      return {
        ...state,
        isSuccess: false,
        message: payload.message,
      };

    case PURCHASE_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        message: payload.message,
      };

    default:
      return state;
  }
}
