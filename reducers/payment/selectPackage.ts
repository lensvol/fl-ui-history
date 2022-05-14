import { IPaymentState } from 'types/payment';

export default function selectPackage(state: IPaymentState, payload: { packageId: number }) {
  const selectedPackage = state.packages.find(({ id }) => id === payload.packageId);
  return {
    ...state,
    selectedPackage,
  };
}