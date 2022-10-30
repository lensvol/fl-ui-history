import React from "react";
import {
  IBraintreePurchaseFateRequest,
  ThreeDSecureCompleteResult,
} from "types/payment";
import PaymentStuff from "components/Payment/PaymentStuff";

export enum PaymentStep {
  Details,
  Processing,
  Failure,
  Success,
}

interface Props {
  onCancel: () => void;
  onThreeDSecureComplete: (
    result: ThreeDSecureCompleteResult<IBraintreePurchaseFateRequest>
  ) => void;
}

export default function BraintreeView({
  onCancel,
  onThreeDSecureComplete,
}: Props) {
  return (
    <PaymentStuff
      onCancel={onCancel}
      onThreeDSComplete={onThreeDSecureComplete}
    />
  );
}
