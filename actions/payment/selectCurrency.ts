import { handleVersionMismatch } from 'actions/versionSync';
import {
  SELECT_CURRENCY_FAILURE,
  SELECT_CURRENCY_REQUESTED,
  SELECT_CURRENCY_SUCCESS,
} from 'actiontypes/payment';
import { ActionCreator } from 'redux';
import { VersionMismatch } from 'services/BaseService';
import PaymentService from 'services/PaymentService';
import { IBraintreeNexOptionsResponse } from 'types/payment';

const paymentService = new PaymentService();

type SelectCurrencyRequested = { type: typeof SELECT_CURRENCY_REQUESTED, payload: { currency: string } };
type SelectCurrencySuccess = {
  type: typeof SELECT_CURRENCY_SUCCESS,
  payload: IBraintreeNexOptionsResponse & { currency: string },
};
type SelectCurrencyFailure = {
  type: typeof SELECT_CURRENCY_FAILURE,
  payload: {
    error: boolean,
    status: number | null | undefined,
  },
};

export type SelectCurrencyActions = SelectCurrencyRequested | SelectCurrencyFailure | SelectCurrencySuccess;

/** ----------------------------------------------------------------------------
 * SELECT CURRENCY
 -----------------------------------------------------------------------------*/
export default function selectCurrency(currencyCode: string) {
  return async (dispatch: Function) => {
    dispatch(selectCurrencyRequested(currencyCode));

    try {
      const { data } = await paymentService.selectCurrency(currencyCode);
      dispatch(selectCurrencySuccess(data, currencyCode));
      return data;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }
      dispatch(selectCurrencyFailure(error));
    }
  };
}

export const selectCurrencyRequested: ActionCreator<SelectCurrencyRequested> = (currencyCode: string) => ({
  type: SELECT_CURRENCY_REQUESTED,
  payload: { currency: currencyCode },
});

export const selectCurrencySuccess: ActionCreator<SelectCurrencySuccess> = (
  data: IBraintreeNexOptionsResponse,
  currencyCode: string,
) => ({
  type: SELECT_CURRENCY_SUCCESS,
  payload: { ...data, currency: currencyCode },
});

export const selectCurrencyFailure: ActionCreator<SelectCurrencyFailure> = (error: any) => ({
  type: SELECT_CURRENCY_FAILURE,
  payload: {
    error: true,
    status: error?.response?.status,
  },
});
