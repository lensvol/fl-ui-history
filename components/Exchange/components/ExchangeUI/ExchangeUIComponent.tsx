import React, { useRef } from "react";

import StateChangeButton from "components/Exchange/components/ExchangeUI/StateChangeButton";
import { MAX_BUY_AMOUNT, MAX_SELL_AMOUNT } from "components/Exchange/constants";
import Image from "components/Image";
import QualityValue from "components/QualityValue";

import { QUALITY_ID_PENNY } from "constants/possessions";

import { IAvailability } from "types/exchange";

export default function ExchangeUI({
  activeItem,
  buying,
  countCharacterAlreadyHas,
  disabled,
  onChange,
  onIncrement,
  onSubmit,
  maxAmount,
  sellAmount,
}: Props) {
  const input = useRef<HTMLInputElement>(null);

  const { availability } = activeItem;

  const buttonText = buying ? "Buy" : "Sell";
  const verb = buttonText.toLowerCase();
  const priceValue = buying ? availability.cost : availability.sellPrice;
  const title = `Please select a number to ${verb}`;
  const tooltipData = availability.quality;
  const transactionLimit = buying ? MAX_BUY_AMOUNT : MAX_SELL_AMOUNT;

  return (
    <div>
      <div className="exchange-ui__header">
        <h3
          className="heading heading--2"
          style={{
            color: "#000",
          }}
        >
          {title}
        </h3>
      </div>

      <div className="exchange-ui__item">
        <div
          className="media__left"
          style={{
            paddingBottom: "0",
          }}
        >
          <div className="js-icon icon js-tt icon--inventory icon--emphasize">
            <Image
              alt={availability.quality.name}
              icon={availability.quality.image}
              tooltipData={tooltipData}
              type="small-icon"
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
          You may {verb} up to {transactionLimit.toLocaleString("en-GB")} items
          at a time. If you need to {verb} more, do so in batches.
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
              autoFocus
              className="form__control form__control--1h"
              max={transactionLimit}
              min={1}
              onChange={onChange}
              ref={input}
              style={{
                marginLeft: "4px",
              }}
              type="number"
              value={sellAmount}
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

ExchangeUI.displayName = "ExchangeUI";

type Props = {
  activeItem: IAvailability;
  buying: boolean;
  countCharacterAlreadyHas: number;
  disabled: boolean;
  maxAmount: number;
  onChange: (change: React.ChangeEvent<HTMLInputElement>) => void;
  onIncrement: Function;
  onSubmit: (evt: any) => void;
  sellAmount: number;
};
