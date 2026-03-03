import { ThunkDispatch } from "redux-thunk";

import { fetch as fetchFate } from "actions/fate";
import { handleVersionMismatch } from "actions/versionSync";

import {
  CLOSE_DIALOG,
  OPEN_DIALOG,
  PURCHASE_FAILURE,
  PURCHASE_REQUESTED,
  PURCHASE_SUCCESS,
  SELECT_PACKAGE,
} from "actiontypes/payment";

import { Success, Failure } from "services/BaseMonadicService";
import { VersionMismatch } from "services/BaseService";
import PaymentService from "services/PaymentService";

import { IBraintreePurchaseFateRequest } from "types/payment";

const paymentService = new PaymentService();

/** ----------------------------------------------------------------------------
 * Payment Dialog
 -----------------------------------------------------------------------------*/
export const openDialog = (paymentType: any) => ({
  type: OPEN_DIALOG,
  payload: {
    paymentType,
  },
});

export const closeDialog = () => ({
  type: CLOSE_DIALOG,
});

/** ----------------------------------------------------------------------------
 * SELECT PACKAGE
 -----------------------------------------------------------------------------*/
export const selectPackage = (packageId: number) => ({
  type: SELECT_PACKAGE,
  payload: {
    packageId,
  },
});

/** ----------------------------------------------------------------------------
 * PURCHASE ( with braintree )
 -----------------------------------------------------------------------------*/
const purchaseWithBraintreeSuccess = (data: {
  message?: string | undefined;
  isSuccess: boolean;
}) => ({
  type: PURCHASE_SUCCESS,
  payload: {
    isSuccess: data.isSuccess,
    message: data.message,
  },
});

const purchaseWithBraintreeFailure = (error?: any) => ({
  type: PURCHASE_FAILURE,
  payload: error?.message,
  error: true,
  status: error?.response?.status,
});

const purchaseWithBraintreeRequested = () => ({
  type: PURCHASE_REQUESTED,
});

export const purchaseWithBraintree =
  (reqData: IBraintreePurchaseFateRequest) =>
  async (dispatch: ThunkDispatch<any, any, any>) => {
    dispatch(purchaseWithBraintreeRequested());

    try {
      const result = await paymentService.purchaseWithBraintree(reqData);

      if (result.data?.isSuccess) {
        dispatch(purchaseWithBraintreeSuccess(result.data));
        dispatch(fetchFate());

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
