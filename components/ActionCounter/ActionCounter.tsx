import React, {
  PureComponent,
  Fragment,
} from 'react';
import { connect } from 'react-redux';

import ReactCSSTransitionReplace from 'react-css-transition-replace';

import Loading from 'components/Loading';
import { IAppState } from 'types/app';

class ActionCounter extends PureComponent<Props> {
  static displayName = 'ActionCounter';

  renderTimer() {
    const {
      actions,
      actionBankSize,
      message,
      onClick,
    } = this.props;

    if (actions === undefined) {
      return (
        <Loading
          spinner
          small
        />
      );
    }

    // If we have more than 0 actions available, just render the time until
    // the next refresh
    if (actions > 0) {
      return (
        <Fragment>
          <div className="item__value">
            {`${actions}/${actionBankSize}`}
          </div>
          <div style={{ fontWeight: 'bold' }}>
            {actions < actionBankSize && message}
          </div>
        </Fragment>
      );
    }

    // If we have no more actions, render a link to purchase actions
    return (
      <Fragment>
        <div className="item__value">
          {`${actions}/${actionBankSize}`}
        </div>
        <div style={{ fontWeight: 'bold' }}>
          {message}
        </div>
        <button
          className="button button--secondary"
          onClick={onClick}
          style={{ marginTop: '.5rem' }}
          type="button"
        >
          Refresh
        </button>
      </Fragment>
    );
  }

  render() {
    return (
      <div>
        <ReactCSSTransitionReplace
          transitionName="fade-wait"
          transitionEnterTimeout={100}
          transitionLeaveTimeout={100}
        >
          {this.renderTimer()}
        </ReactCSSTransitionReplace>
      </div>
    );
  }
}

const mapStateToProps = ({
  actions: { actions, actionBankSize },
}: IAppState) => ({
  actions,
  actionBankSize,
});

type Props = ReturnType<typeof mapStateToProps> & {
  message: string,
  onClick: () => void,
};

export default connect(mapStateToProps)(ActionCounter);