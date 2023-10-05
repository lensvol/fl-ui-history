import { handleVersionMismatch } from "actions/versionSync";
import {
  FETCH_FAILURE,
  FETCH_REQUESTED,
  FETCH_SUCCESS,
  MODIFY_BRAINTREE_SUBSCRIPTION_FAILURE,
  MODIFY_BRAINTREE_SUBSCRIPTION_REQUESTED,
  MODIFY_BRAINTREE_SUBSCRIPTION_SUCCESS,
} from "actiontypes/subscription";
import { ThunkDispatch } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";

import SubscriptionService from "services/SubscriptionService";
import { Dispatch } from "redux";
import {
  FetchSubscriptionResponse,
  IModifySubscriptionSuccessData,
  ISubscriptionService,
  PremiumSubscriptionType,
} from "types/subscription";

const service: ISubscriptionService = new SubscriptionService();

export type FetchSubscriptionSuccess = {
  type: typeof FETCH_SUCCESS;
  payload: FetchSubscriptionResponse;
};

type FetchOptions = {
  fetchInBackground?: boolean;
};

type ModifyOptions = {
  modifyInBackground?: boolean;
  subscriptionType: PremiumSubscriptionType;
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

export const modifyBraintreeSubscriptionRequested = () => ({
  type: MODIFY_BRAINTREE_SUBSCRIPTION_REQUESTED,
});

export const modifyBraintreeSubscriptionSuccess = (
  data: IModifySubscriptionSuccessData
) => ({
  type: MODIFY_BRAINTREE_SUBSCRIPTION_SUCCESS,
  payload: data,
});

export const modifyBraintreeSubscriptionFailure = (error: any) => ({
  type: MODIFY_BRAINTREE_SUBSCRIPTION_FAILURE,
  error: true,
  status: error.response?.status,
});

export const modifyBraintreeSubscription =
  (options: ModifyOptions) =>
  async (dispatch: ThunkDispatch<any, any, any>) => {
    if (!options.modifyInBackground) {
      dispatch(modifyBraintreeSubscriptionRequested());
    }

    try {
      const { data } = await service.modifyBraintreeSubscription(
        options.subscriptionType
      );

      dispatch(modifyBraintreeSubscriptionSuccess(data));

      return data;
    } catch (error) {
      if (error instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(error));

        return error;
      }

      dispatch(modifyBraintreeSubscriptionFailure(error));

      throw error;
    }
  };
