import React from "react";

import Loading from "components/Loading";
import { NexQuantity } from "types/payment";

export default function SubmitButton(props: Props) {
  const {
    isPurchasing,
    isWaitingForReCaptcha,
    isWaitingForInstance,
    selectedPackage,
    onClick,
  } = props;

  const disabled =
    isPurchasing ||
    isWaitingForInstance ||
    isWaitingForReCaptcha ||
    !selectedPackage;

  return (
    <button
      className="button button--secondary"
      type="submit"
      onClick={onClick}
      disabled={disabled}
    >
      <ButtonLabel {...props} />
    </button>
  );
}

SubmitButton.displayName = "SubmitButton";

type Props = {
  isPurchasing: boolean;
  isWaitingForInstance: boolean;
  isWaitingForReCaptcha: boolean;
  onClick: () => void;
  selectedPackage: NexQuantity | undefined;
};

function ButtonLabel({
  isPurchasing,
  isWaitingForInstance,
  selectedPackage,
}: Props) {
  if (isPurchasing || isWaitingForInstance) {
    return <Loading spinner small />;
  }
  if (selectedPackage) {
    return <span>Buy {selectedPackage.quantity} FATE</span>;
  }
  return <span>Complete purchase</span>;
}
