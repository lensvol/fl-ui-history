export default function modifyBraintreeSubscriptionSuccess(state, payload) {
  return {
    ...state,
    isModifying: false,
    isSuccess: payload.isSuccess,
    message: payload.message,
  };
}
