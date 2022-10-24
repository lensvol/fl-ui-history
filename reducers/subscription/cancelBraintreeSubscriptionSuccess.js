export default function cancelBraintreeSubscriptionSuccess(state, payload) {
  let hasBraintreeSubscription = state.data
    ? state.data.hasBraintreeSubscription
    : null;

  if (payload.isSuccess) {
    hasBraintreeSubscription = false;
  }

  return {
    ...state,
    isCancelling: false,
    isSuccess: payload.isSuccess,
    message: payload.message,
    data: {
      ...state.data,
      hasBraintreeSubscription,
    },
  };
}
