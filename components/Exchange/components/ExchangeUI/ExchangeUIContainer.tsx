/* eslint-disable dot-notation */
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import { buyItems, fetchAvailableItems, sellItems } from "actions/exchange";

import ExchangeUI from "components/Exchange/components/ExchangeUI/ExchangeUIComponent";
import { MAX_BUY_AMOUNT, MAX_SELL_AMOUNT } from "components/Exchange/constants";
import { playerCanAffordTransaction } from "components/Exchange/utils";

import { useAppSelector } from "features/app/store";

import getQuantities from "selectors/exchange/getQuantities";

import { Success } from "services/BaseMonadicService";

import { IAvailability } from "types/exchange";
import { IQuality } from "types/qualities";

function isNewQuality(possession: IQuality, items: IAvailability[]) {
  // If we've received some Echoes, then definitely return false; Echoes don't appear in any shop
  if (possession.category === "Currency") {
    return false;
  }

  // If we don't already have an Availability with this Quality, return true
  return items.map((_) => _.availability.quality.id).indexOf(possession.id) < 0;
}

type Props = {
  activeItem: IAvailability | null;
  onTransactionComplete: (message: string, isSuccess: boolean) => void;
};

export default function ExchangeUIContainer({
  activeItem,
  onTransactionComplete,
}: Props) {
  const dispatch: Function = useDispatch();

  const shops = useAppSelector((state) => state.exchange.shops);
  const quantities = useAppSelector((state) => getQuantities(state));

  const [disabled, setDisabled] = useState(false);
  const [sellAmount, setSellAmount] = useState(1);
  const [didLoad, setDidLoad] = useState(false);

  const upperLimit = useMemo(() => {
    if (!activeItem) {
      return 0;
    }

    const { forSale: buying } = activeItem;

    return buying ? MAX_BUY_AMOUNT : MAX_SELL_AMOUNT;
  }, [activeItem]);

  const getMaxAmount = useCallback(() => {
    if (!activeItem) {
      return 0;
    }

    const { forSale: buying } = activeItem;

    const { cost, purchaseQuality, quality } = activeItem.availability;

    // If we are buying an item, then the maximum amount is the largest number
    // that we can afford, given the purchase quality and how much of _that_ we have
    if (buying) {
      const playerCurrencyLevel = quantities[purchaseQuality.id] || 0;

      return Math.floor(playerCurrencyLevel / cost);
    }

    // Otherwise, we can sell up to as many of the item as we have in our inventory
    return quantities[quality.id];
  }, [activeItem, quantities]);

  const clampAmount = useCallback(
    (newSellAmount: number) => {
      // We're clamping the sell amount to [0, max], where max is determined differently
      // depending on whether we're buying or selling
      const maxAmount = getMaxAmount();

      return Math.max(0, Math.min(newSellAmount, maxAmount, upperLimit));
    },
    [getMaxAmount, upperLimit]
  );

  const updateDisabledState = useCallback(
    (newSellAmount: number) => {
      if (!activeItem) {
        return;
      }

      const { forSale: buying } = activeItem;

      if (Number.isNaN(parseInt(`${newSellAmount}`, 10))) {
        setDisabled(true);

        return;
      }

      if (newSellAmount < 1) {
        setDisabled(true);

        return;
      }

      // ... but if we *can* parse it as a value, then set an error message if
      // the user is trying to buy or sell too many at once
      const transactionLimit = buying ? MAX_BUY_AMOUNT : MAX_SELL_AMOUNT;

      if (newSellAmount > transactionLimit) {
        setDisabled(true);

        return;
      }

      // If the player can't afford this (buying or selling), then disable
      if (
        !playerCanAffordTransaction({
          activeItem,
          buying,
          quantities,
          sellAmount: newSellAmount,
        })
      ) {
        setDisabled(true);

        return;
      }

      setDisabled(Number.isNaN(+newSellAmount));
    },
    [activeItem, quantities]
  );

  const handleChange = useCallback(
    (e: any) => {
      const newSellAmount = clampAmount(e.target.value);

      // Update sell amount then update disabled state
      setSellAmount(newSellAmount);
      updateDisabledState(newSellAmount);
    },
    [clampAmount, updateDisabledState]
  );

  const handleIncrement = useCallback(
    (amount: number) => {
      const newSellAmount = (+sellAmount || 0) + Number(amount);

      // Update sell amount (clamping it to possible values) then update disabled state
      setSellAmount(clampAmount(newSellAmount));
      updateDisabledState(newSellAmount);
    },
    [clampAmount, sellAmount, updateDisabledState]
  );

  useEffect(() => {
    if (didLoad) {
      return;
    }

    setDidLoad(true);

    // Immediately set disabled if the player can't even afford to buy/sell 1 of this item
    updateDisabledState(sellAmount);
  }, [didLoad, sellAmount, updateDisabledState]);

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      if (!activeItem) {
        return;
      }

      const buying = activeItem.forSale;

      const { purchaseQuality, quality } = activeItem.availability;

      const transactionData = {
        amount: Number(sellAmount),
        availabilityId: activeItem.availability.id,
        purchaseQuality,
        quality,
      };

      // The action data are the same whether we're buying or selling;
      // it's just the API connection that's different
      const action = buying
        ? buyItems(transactionData)
        : sellItems(transactionData);

      const result = await dispatch(action);

      if (result instanceof Success) {
        const { data } = result;

        const { message: successMessage, possessionsChanged: changes } = data;

        // We should update the UI to show the success message
        onTransactionComplete(successMessage, true);

        // Check whether, by buying or selling stuff, we have acquired something new
        const myItems = shops["null"].items;

        if (changes?.some((q: IQuality) => isNewQuality(q, myItems))) {
          // Dispatch a full on re-fetch of sellable items
          dispatch(fetchAvailableItems("null", { background: true }));
        }
      } else {
        // We should update the UI to show the success message
        onTransactionComplete(result.message, false);
      }
    },
    [activeItem, dispatch, onTransactionComplete, sellAmount, shops]
  );

  if (!activeItem) {
    return null;
  }

  return (
    <ExchangeUI
      activeItem={activeItem}
      buying={activeItem.forSale}
      countCharacterAlreadyHas={quantities[activeItem.availability.quality.id]}
      disabled={disabled}
      maxAmount={getMaxAmount()}
      onChange={handleChange}
      onIncrement={handleIncrement}
      onSubmit={handleSubmit}
      sellAmount={sellAmount}
    />
  );
}

ExchangeUIContainer.displayName = "ExchangeUIContainer";
