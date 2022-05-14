import { IBraintreeNexOptionsResponse, IPaymentState } from 'types/payment';

export default function selectCurrencySuccess(state: IPaymentState, payload: IBraintreeNexOptionsResponse) {
  // add an id for each package
  const packages = payload.packages.map((item, i) => ({
    ...item,
    id: i + 1,
  }));

  return {
    ...state,
    ...payload,
    packages,
    isFetching: false,
    // currency: payload.currency,
    selectedPackage: packages[0],
  };
}