import * as PaymentActionTypes from "actiontypes/payment";

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
  currency: "",
  currencies: {},
  currencyCode: undefined,
  environmentPrefix: null,
  isBreakdownVisible: false,
  isBraintree: true,
  isDialogOpen: false,
  isFetching: false,
  isPurchasing: false,
  isSuccess: false,
  message: undefined,
  packages: [],
  paymentType: null,
  selectedPackage: undefined,
};

/**
 * Payment Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
export default function reducer(
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) {
  const { payload = {} } = action;

  switch (action.type) {
    case PaymentActionTypes.OPEN_DIALOG:
      return {
        ...state,
        isDialogOpen: true,
        isSuccess: false,
        message: null,
        paymentType: payload.paymentType,
      };

    case PaymentActionTypes.CLOSE_DIALOG:
      return {
        ...state,
        isDialogOpen: false,
        selectedPackage: null,
        isSuccess: false,
        message: null,
      };

    case PaymentActionTypes.SELECT_CURRENCY_REQUESTED:
      return {
        ...state,
        isFetching: true,
        currency: payload.currency,
        selectedPackage: null,
      };

    case PaymentActionTypes.SELECT_CURRENCY_SUCCESS:
      return selectCurrencySuccess(state, payload);

    case PaymentActionTypes.SELECT_CURRENCY_FAILURE:
      return {
        ...state,
        isFetching: false,
        currency: payload.currency,
      };

    case PaymentActionTypes.SELECT_PACKAGE:
      return selectPackage(state, payload);

    case PaymentActionTypes.PURCHASE_REQUESTED:
      return {
        ...state,
        isPurchasing: true,
      };

    case PaymentActionTypes.PURCHASE_FAILURE:
      return {
        ...state,
        isPurchasing: false,
        isSuccess: false,
        message: payload.message,
      };

    case PaymentActionTypes.PURCHASE_SUCCESS:
      return {
        ...state,
        isPurchasing: false,
        isSuccess: true,
        message: payload.message,
      };

    case PaymentActionTypes.TOGGLE_PRICE_BREAKDOWN:
      return {
        ...state,
        isBreakdownVisible: !state.isBreakdownVisible,
      };

    case PaymentActionTypes.TOGGLE_PAYMENT_PROVIDER:
      return {
        ...state,
        isBraintree: !state.isBraintree,
      };

    default:
      return state;
  }
}
