/* eslint-disable dot-notation */

import { buyItems, fetchAvailableItems, sellItems, } from 'actions/exchange';
import { MAX_SELL_AMOUNT } from 'components/Exchange/constants';
import { ExchangeContextValue } from 'components/Exchange/ExchangeContext';

import { playerCanAffordTransaction } from 'components/Exchange/utils';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import getQuantities from 'selectors/exchange/getQuantities';
import { Success } from 'services/BaseMonadicService';
import { IAppState } from 'types/app';
import { IAvailability } from 'types/exchange';
import { IQuality } from 'types/qualities';

import ExchangeUI from './ExchangeUIComponent';

function isNewQuality(possession: IQuality, items: IAvailability[]) {
  // If we've received some Echoes, then definitely return false; Echoes don't
  // appear in any shop
  if (possession.category === 'Currency') {
    return false;
  }
  // If we don't already have an Availability with this Quality, return true
  return items.map(_ => _.availability.quality.id).indexOf(possession.id) < 0;
}

type State = {
  disabled: boolean,
  errorMessage?: string | null,
  sellAmount: number,
};

type OwnProps = {
  onRequestClose: () => void,
  onTransactionComplete: (message: string) => void,
};

type Props
  = OwnProps
  & Pick<ExchangeContextValue, 'activeItem'>
  & ReturnType<typeof mapStateToProps>
  & { dispatch: Function };

class ExchangeUIContainer extends Component<Props, State> {
  static displayName = 'ExchangeUIContainer';

  state: State = {
    disabled: false,
    sellAmount: 1,
  };

  componentDidMount = () => {
    // Immediately set disabled if the player can't even afford to buy/sell 1 of this item
    this.updateDisabledState();
  };

  handleIncrement = (amount: number) => {
    const { sellAmount: oldSellAmount } = this.state;
    const sellAmount = (+oldSellAmount || 0) + Number(amount);
    // Update sell amount (clamping it to possible values) then update disabled state
    this.setState({ sellAmount: this.clampAmount(sellAmount) }, this.updateDisabledState);
  };

  handleChange = (e: any) => {
    const sellAmount = e.target.value;

    // Update sell amount then update disabled state
    this.setState({ sellAmount }, this.updateDisabledState);
  };

  handleSubmit = async (e: any) => {
    const {
      activeItem,
      dispatch,
      onTransactionComplete,
      shops,
    } = this.props;

    e.preventDefault();

    if (!activeItem) {
      return;
    }

    const buying = activeItem.forSale;

    const { sellAmount } = this.state;
    const { quality, purchaseQuality } = activeItem.availability;

    const transactionData = {
      quality,
      purchaseQuality,
      availabilityId: activeItem.availability.id,
      amount: sellAmount,
    };

    // The action data are the same whether we're buying or selling;
    // it's just the API connection that's different
    const action = buying ? buyItems(transactionData) : sellItems(transactionData);

    const result = await dispatch(action);
    if (result instanceof Success) {
      const { data } = result;
      const {
        message: successMessage,
        possessionsChanged: changes,
      } = data;
      // We should update the UI to show the success message
      onTransactionComplete(successMessage);

      // Check whether, by buying or selling stuff, we have acquired something new
      const myItems = shops['null'].items;
      if (changes?.some((q: IQuality) => isNewQuality(q, myItems))) {
        // Dispatch a full on re-fetch of sellable items
        dispatch(fetchAvailableItems('null', { background: true }));
      }
    }
  };

  clampAmount = (newSellAmount: number) => {
    // We're clamping the sell amount to [0, max], where max is determined differently
    // depending on whether we're buying or selling
    const maxAmount = this.getMaxAmount();
    return Math.max(0, Math.min(newSellAmount, maxAmount));
  };

  getMaxAmount = () => {
    const { activeItem, quantities } = this.props;
    if (!activeItem) {
      return 0;
    }
    const { forSale: buying } = activeItem;

    const {
      cost,
      purchaseQuality,
      quality
    } = activeItem.availability;

    // If we are buying an item, then the maximum amount is the largest number
    // that we can afford, given the purchase quality and how much of _that_ we have
    if (buying) {
      const playerCurrencyLevel = quantities[purchaseQuality.id] || 0;
      return Math.floor(playerCurrencyLevel / cost);
    }
    // Otherwise, we can sell up to as many of the item as we have in our inventory
    return quantities[quality.id];
  };

  updateDisabledState = () => {
    const { activeItem } = this.props;
    const { sellAmount } = this.state;

    if (!activeItem) {
      return;
    }

    const { forSale: buying } = activeItem;

    if (sellAmount === 0) {
      return this.setState({ disabled: true });
    }

    // ... but if we *can* parse it as a value, then set an error message if
    // the user is trying to sell too many at once

    // if (parseInt(sellAmount, 10) > MAX_SELL_AMOUNT) {
    if (sellAmount > MAX_SELL_AMOUNT) {
      return this.setState({
        disabled: true,
      });
    }

    // If the player can't afford this (buying or selling), then disable
    if (!playerCanAffordTransaction({
      ...this.props,
      ...this.state,
      activeItem,
      buying,
    })) {
      return this.setState({
        disabled: true,
        errorMessage: null,
      });
    }

    return this.setState({
      errorMessage: null,
      disabled: Number.isNaN(+sellAmount),
    });
  };

  render() {
    const {
      activeItem,
      quantities,
    } = this.props;

    const { disabled, sellAmount } = this.state;

    if (!activeItem) {
      return null;
    }

    const buying = activeItem.forSale;

    return (
      <ExchangeUI
        activeItem={activeItem}
        buying={buying}
        countCharacterAlreadyHas={quantities[activeItem.availability.quality.id]}
        disabled={disabled}
        maxAmount={this.getMaxAmount()}
        onChange={this.handleChange}
        onIncrement={this.handleIncrement}
        onSubmit={this.handleSubmit}
        sellAmount={sellAmount}
      />
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  const {
    exchange: {
      isFetchingSellItem,
      shops,
    },
  } = state;
  return {
    isFetchingSellItem,
    shops,
    quantities: getQuantities(state),
  };
};

export default connect(mapStateToProps)(ExchangeUIContainer);