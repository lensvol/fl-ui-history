import React from 'react';
import { connect } from 'react-redux';

import getVisibleExchangeItems from 'selectors/exchange/getVisibleExchangeItems';
import { IAppState } from 'types/app';
import { IAvailability } from 'types/exchange';

import ExchangeItem from './ExchangeItem';
import ExchangeContext from 'components/Exchange/ExchangeContext';

type OwnProps = {
  filterString: string,
  quantities: { [key: number]: number },
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & {
  dispatch: Function,
};

export class ExchangeItems extends React.Component<Props> {
  static displayName = 'ExchangeItems';

  render() {
    let { items, quantities } = this.props;
    return items.map((availability: IAvailability) => (
      <ExchangeContext.Consumer key={availability.availability.id}>
        {({ onStartTransaction }) => (
          <ExchangeItem
            onStartTransaction={onStartTransaction}
            data={availability}
            quantity={quantities[availability.availability.quality.id]}
          />
        )}
      </ExchangeContext.Consumer>
    ));
  }
}

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  items: getVisibleExchangeItems(state, props),
});

export default connect(mapStateToProps)(ExchangeItems);