import * as SubscriptionActionTypes from "actiontypes/subscription";

import modifyBraintreeSubscriptionSuccess from "reducers/subscription/modifyBraintreeSubscriptionSuccess";
import { ISubscriptionState } from "types/subscription";

/**
 * Initial state
 * @type {Object}
 */
const INITIAL_STATE: ISubscriptionState = {
  data: undefined,
  isFetching: false,
  isModifying: false,
  isSuccess: false,
  message: null,
};

/**
 * Fate Reducer
 * @param {Object} state
 * @param {[Object]} action
 */
export default function reducer(
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) {
  const { payload = {} } = action;

  switch (action.type) {
    case SubscriptionActionTypes.FETCH_REQUESTED:
      return { ...state, isFetching: true };

    case SubscriptionActionTypes.FETCH_FAILURE:
      return { ...state, isFetching: false };

    case SubscriptionActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: payload,
      };

    case SubscriptionActionTypes.MODIFY_BRAINTREE_SUBSCRIPTION_REQUESTED:
      return {
        ...state,
        isModifying: true,
        isSuccess: false,
      };

    case SubscriptionActionTypes.MODIFY_BRAINTREE_SUBSCRIPTION_FAILURE:
      return {
        ...state,
        isModifying: false,
        isSuccess: false,
      };

    case SubscriptionActionTypes.MODIFY_BRAINTREE_SUBSCRIPTION_SUCCESS:
      return modifyBraintreeSubscriptionSuccess(state, payload);

    default:
      return state;
  }
}
