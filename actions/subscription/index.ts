import { handleVersionMismatch } from "actions/versionSync";
import {
  CANCEL_BRAINTREE_SUBSCRIPTION_FAILURE,
  CANCEL_BRAINTREE_SUBSCRIPTION_REQUESTED,
  CANCEL_BRAINTREE_SUBSCRIPTION_SUCCESS,
  FETCH_FAILURE,
  FETCH_REQUESTED,
  FETCH_SUCCESS,
} from "actiontypes/subscription";
import { fetch as fetchMap } from "actions/map";
import { fetch as fetchSettings } from "actions/settings";
import { ThunkDispatch } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";

import SubscriptionService from "services/SubscriptionService";
import { Dispatch } from "redux";
import {
  FetchSubscriptionResponse,
  ICancelSubscriptionSuccessData,
  ISubscriptionService,
} from "types/subscription";

const service: ISubscriptionService = new SubscriptionService();

export type FetchSubscriptionSuccess = {
  type: typeof FETCH_SUCCESS;
  payload: FetchSubscriptionResponse;
};

type CancelOptions = {
  cancelInBackground?: boolean;
};

type FetchOptions = {
  fetchInBackground?: boolean;
};

export const fetchSubscriptionRequested = () => ({ type: FETCH_REQUESTED });

export const fetchSubscriptionSuccess = (data: FetchSubscriptionResponse) => ({
  type: FETCH_SUCCESS,
  payload: data,
});

export const fetchSubscriptionFailure = (error: any) => ({
  type: FETCH_FAILURE,
  error: true,
  status: error.response?.status,
});

export const fetch = (options?: FetchOptions) => async (dispatch: Dispatch) => {
  if (!options?.fetchInBackground) {
    dispatch(fetchSubscriptionRequested());
  }

  try {
    const { data } = await service.fetchSubscription();
    dispatch(fetchSubscriptionSuccess(data));
  } catch (error) {
    dispatch(fetchSubscriptionFailure(error));
  }
};

export const cancelBraintreeSubscriptionRequested = () => ({
  type: CANCEL_BRAINTREE_SUBSCRIPTION_REQUESTED,
});

export const cancelBraintreeSubscriptionSuccess = (
  data: ICancelSubscriptionSuccessData
) => ({
  type: CANCEL_BRAINTREE_SUBSCRIPTION_SUCCESS,
  payload: {
    isSuccess: data.isSuccess,
    message: data.message,
  },
});

export const cancelBraintreeSubscriptionFailure = (error: any) => ({
  type: CANCEL_BRAINTREE_SUBSCRIPTION_FAILURE,
  error: true,
  status: error.response?.status,
});

export const cancelBraintreeSubscription =
  (options?: CancelOptions) =>
  async (dispatch: ThunkDispatch<any, any, any>) => {
    if (!options?.cancelInBackground) {
      dispatch(cancelBraintreeSubscriptionRequested());
    }

    try {
      const { data } = await service.cancelBraintreeSubscription();

      dispatch(cancelBraintreeSubscriptionSuccess(data));
      dispatch(fetchSettings());

      // We also need to update the map --- the House of Chimes is now off limits
      dispatch(fetchMap());
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));
      }

      dispatch(cancelBraintreeSubscriptionFailure(error));
    }
  };
