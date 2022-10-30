import { FEATURE_SHOW_VAT_BREAKDOWN } from "features/feature-flags";
import React, { useMemo } from "react";
import classnames from "classnames";
import { NexQuantity } from "types/payment";
import { Feature } from "flagged";

type Props = {
  data: NexQuantity;
  id: number | string;
  isBreakdownVisible: boolean;
  isSelected: boolean;
  onSelect: (pkg: NexQuantity) => void;
};

export default function FateOption({
  onSelect,
  id,
  isBreakdownVisible,
  isSelected,
  data,
}: Props) {
  const {
    currency: { code: currencyCode },
    currencyAmount,
    valueAddedTax,
  } = data;
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
          <Feature name={FEATURE_SHOW_VAT_BREAKDOWN}>
            {(enabled: boolean) => {
              if (!enabled) {
                return null;
              }
              return (
                <>
                  <br />
                  <small>
                    Cost {data.currency.sign}
                    {data.currencyAmount.toFixed(2)} VAT {data.currency.sign}
                    {data.valueAddedTax.toFixed(2)}
                  </small>
                </>
              );
            }}
          </Feature>
        </span>
      </label>
    </li>
  );
}

FateOption.displayName = "FateOption";

/*
FateOption.propTypes = {
  data: PropTypes.shape({}).isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isBreakdownVisible: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

 */
