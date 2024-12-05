import React, { useMemo } from "react";

import classnames from "classnames";

import { useFeature } from "flagged";

import { FEATURE_SHOW_VAT_BREAKDOWN } from "features/feature-flags";

import { NexQuantity } from "types/payment";

type Props = {
  data: NexQuantity;
  id: number | string;
  isBreakdownVisible: boolean;
  isSelected: boolean;
  onSelect: (pkg: NexQuantity) => void;
};

export default function FateOption({
  data,
  id,
  isBreakdownVisible,
  isSelected,
  onSelect,
}: Props) {
  const {
    currency: { code: currencyCode },
    currencyAmount,
    valueAddedTax,
  } = data;

  const showVatBreakdown = useFeature(FEATURE_SHOW_VAT_BREAKDOWN);

  const total = useMemo(
    () => currencyAmount + valueAddedTax,
    [currencyAmount, valueAddedTax]
  );

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-GB", {
        currency: currencyCode,
        style: "currency",
      }),
    [currencyCode]
  );

  return (
    <li
      className={classnames(
        "fate-option",
        isBreakdownVisible && "fate-option--breakdown-visible",
        isSelected && "fate-option--selected"
      )}
    >
      <input
        className="fate-option__radio"
        type="radio"
        name="nexAmount"
        onChange={() => onSelect(data)}
        value={id}
        id={id.toString()}
        checked={isSelected}
      />
      <label className="fate-option__label" htmlFor={id.toString()}>
        {data.quantity} FATE{" "}
        <span className="my-price">
          {formatter.format(total)}
          {showVatBreakdown && (
            <>
              <br />
              <small>
                Cost {data.currency.sign}
                {data.currencyAmount.toFixed(2)} VAT {data.currency.sign}
                {data.valueAddedTax.toFixed(2)}
              </small>
            </>
          )}
        </span>
      </label>
    </li>
  );
}

FateOption.displayName = "FateOption";
