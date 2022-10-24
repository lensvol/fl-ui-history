import { handleVersionMismatch } from "actions/versionSync";
import { ThunkDispatch } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";
import * as PaymentActionTypes from "actiontypes/payment";
import * as FateActionCreators from "actions/fate";

import PaymentService from "services/PaymentService";
import { IBraintreePurchaseFateRequest } from "types/payment";
import { Success, Failure } from "services/BaseMonadicService";

export { default as selectCurrency } from "actions/payment/selectCurrency";

const paymentService = new PaymentService();

/** ----------------------------------------------------------------------------
 * Payment Dialog
 -----------------------------------------------------------------------------*/
export const openDialog = (paymentType: any) => ({
  type: PaymentActionTypes.OPEN_DIALOG,
  payload: { paymentType },
});

export const closeDialog = () => ({ type: PaymentActionTypes.CLOSE_DIALOG });

/** ----------------------------------------------------------------------------
 * SELECT PACKAGE
 -----------------------------------------------------------------------------*/

export const selectPackage = (packageId: number) => ({
  type: PaymentActionTypes.SELECT_PACKAGE,
  payload: { packageId },
});

/** ----------------------------------------------------------------------------
 * PURCHASE ( with braintree )
 -----------------------------------------------------------------------------*/

export const purchaseWithBraintreeSuccess = (data: {
  message?: string | undefined;
  isSuccess: boolean;
}) => ({
  type: PaymentActionTypes.PURCHASE_SUCCESS,
  payload: {
    isSuccess: data.isSuccess,
    message: data.message,
  },
});

export const purchaseWithBraintreeFailure = (error?: any) => ({
  type: PaymentActionTypes.PURCHASE_FAILURE,
  payload: error?.message,
  error: true,
  status: error?.response?.status,
});

export const purchaseWithBraintreeRequested = () => ({
  type: PaymentActionTypes.PURCHASE_REQUESTED,
});

export const purchaseWithBraintree =
  (reqData: IBraintreePurchaseFateRequest) =>
  async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(purchaseWithBraintreeRequested());

    try {
      const result = await paymentService.purchaseWithBraintree(reqData);

      if (result.data?.isSuccess) {
        dispatch(purchaseWithBraintreeSuccess(result.data));
        dispatch(FateActionCreators.fetch());
        return new Success<{ message: string }>({
          message: result.data.message ?? "Success",
        });
      }

      dispatch(purchaseWithBraintreeFailure());
      return new Failure(result.data.message ?? "Failure");
    } catch (err) {
      if (err instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(err));
        return err;
      }
      throw err;
    }
  };

export const togglePriceBreakdown = () => ({
  type: PaymentActionTypes.TOGGLE_PRICE_BREAKDOWN,
});

export const togglePaymentProvider = () => ({
  type: PaymentActionTypes.TOGGLE_PAYMENT_PROVIDER,
});
