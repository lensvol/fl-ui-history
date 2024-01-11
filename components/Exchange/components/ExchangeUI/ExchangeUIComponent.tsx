import { QUALITY_ID_PENNY } from "constants/possessions";
import React, { useRef } from "react";

import { MAX_SELL_AMOUNT } from "components/Exchange/constants";

import Image from "components/Image";
import QualityValue from "components/QualityValue";
import { IAvailability } from "types/exchange";
import StateChangeButton from "./StateChangeButton";

export function ExchangeUI(props: Props) {
  const {
    activeItem,
    countCharacterAlreadyHas,
    buying,
    disabled,
    onChange,
    onIncrement,
    onSubmit,
    maxAmount,
    sellAmount,
  } = props;

  const input = useRef<HTMLInputElement>(null);

  const { availability } = activeItem;
  const buttonText = buying ? "Buy" : "Sell";
  const verb = buttonText.toLowerCase();
  const priceValue = buying ? availability.cost : availability.sellPrice;
  const title = buying
    ? "Please select a number to buy"
    : "Please select a number to sell";
  const tooltipData = availability.quality;

  return (
    <div>
      <div className="exchange-ui__header">
        <h3 className="heading heading--2" style={{ color: "#000" }}>
          {title}
        </h3>
      </div>

      <div className="exchange-ui__item">
        <div className="media__left" style={{ paddingBottom: "0" }}>
          <div className="js-icon icon js-tt icon--inventory icon--emphasize">
            <Image
              icon={availability.quality.image}
              alt={availability.quality.name}
              type="small-icon"
              tooltipData={tooltipData}
            />
            {countCharacterAlreadyHas > 0 && (
              <span className="js-item-value icon__value">
                {countCharacterAlreadyHas.toLocaleString("en-GB")}
              </span>
            )}
          </div>
        </div>
        <div className="media__body">
          <h3 className="heading heading--3">{availability.quality.name}</h3>
          {availability.purchaseQuality.id === QUALITY_ID_PENNY ? (
            <QualityValue
              isCurrency={availability.purchaseQuality.id === QUALITY_ID_PENNY}
              quality={availability.purchaseQuality}
              value={priceValue * (+sellAmount || 0)}
            />
          ) : (
            <>
              {(priceValue * (+sellAmount || 0)).toLocaleString("en-GB")} ×{" "}
              {availability.purchaseQuality.name}
            </>
          )}
        </div>
      </div>
      <div className="exchange-ui__rubric-and-controls">
        <em>
          You may buy or sell up to 60,000 items at a time. If you need to{" "}
          {verb} more, do so in batches.
        </em>
        <form className="exchange-ui__form" onSubmit={onSubmit}>
          <div className="exchange-ui__controls">
            <StateChangeButton
              by={-10}
              onClick={onIncrement}
              maxAmount={maxAmount}
              sellAmount={sellAmount}
            />
            <StateChangeButton
              by={-1}
              onClick={onIncrement}
              maxAmount={maxAmount}
              sellAmount={sellAmount}
            />
            <input
              type="number"
              className="form__control form__control--1h"
              max={MAX_SELL_AMOUNT}
              min={1}
              style={{ marginLeft: "4px" }}
              value={sellAmount}
              onChange={onChange}
              ref={input}
              autoFocus
            />
            <StateChangeButton
              by={+1}
              onClick={onIncrement}
              maxAmount={maxAmount}
              sellAmount={sellAmount}
            />
            <StateChangeButton
              by={+10}
              onClick={onIncrement}
              maxAmount={maxAmount}
              sellAmount={sellAmount}
            />
          </div>
          <div className="exchange-ui__submit-button-container">
            <button
              className="button button--primary"
              disabled={disabled}
              type="submit"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

type Props = {
  activeItem: IAvailability;
  buying: boolean;
  disabled: boolean;
  countCharacterAlreadyHas: number;
  maxAmount: number;
  onChange: (change: React.ChangeEvent<HTMLInputElement>) => void;
  onIncrement: Function;
  onSubmit: (evt: any) => void;
  sellAmount: number;
};

export default ExchangeUI;
