import React, { Component } from 'react';
import { connect } from 'react-redux';

import getQuantities from 'selectors/exchange/getQuantities';
import { IAppState } from 'types/app';

import StateChangeButtonComponent from './StateChangeButtonComponent';

export class StateChangeButtonContainer extends Component<Props> {
  isDisabled = () => {
    const {
      by,
      maxAmount,
      sellAmount,
    } = this.props;

    // If this is a positive increment, then we're disabled if we are at (or above) the cap
    if (by > 0) {
      return sellAmount >= maxAmount;
    }

    // Otherwise, we're disabled if we're at or below 0
    return sellAmount <= 0;
  };

  render = () => {
    const {
      by,
      onClick,
    } = this.props;

    return (
      <StateChangeButtonComponent
        by={by}
        disabled={this.isDisabled()}
        onClick={onClick}
      />
    );
  }
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

type OwnProps = {
  by: number,
  maxAmount: number,
  onClick: Function,
  sellAmount: number,
};

const mapStateToProps = (state: IAppState) => {
  return {
    quantities: getQuantities(state),
  };
};

export default connect(mapStateToProps)(StateChangeButtonContainer);