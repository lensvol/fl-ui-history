import React, { useMemo } from "react";

import StateChangeButtonComponent from "components/Exchange/components/ExchangeUI/StateChangeButton/StateChangeButtonComponent";

type Props = {
  by: number;
  maxAmount: number;
  onClick: Function;
  sellAmount: number;
};

export default function StateChangeButtonContainer({
  by,
  maxAmount,
  onClick,
  sellAmount,
}: Props) {
  const isDisabled = useMemo(() => {
    // If this is a positive increment, then we're disabled if clicking would put us above the cap
    if (by > 0) {
      return sellAmount + by > maxAmount;
    }

    // Otherwise, we're disabled if clicking the button would put us at or below 0
    return sellAmount + by <= 0;
  }, [by, maxAmount, sellAmount]);

  return (
    <StateChangeButtonComponent
      by={by}
      disabled={isDisabled}
      onClick={onClick}
    />
  );
}

StateChangeButtonContainer.displayName = "StateChangeButtonContainer";
