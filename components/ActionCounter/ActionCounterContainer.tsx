import { IActionRefreshContextValues } from 'components/ActionRefreshContext/ActionRefreshContext';
import React, {
  Component,
  Fragment,
} from 'react';
import { connect } from 'react-redux';
import {
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import moment from 'moment';

import { withActionRefreshContext } from 'components/ActionRefreshContext';

import Image from 'components/Image';
import { IAppState } from 'types/app';

import ActionCounter from './ActionCounter';

class ActionCounterContainer extends Component<Props> {
  static displayName = 'ActionCounterContainer';

  handleClick = () => {
    const { actions, history, onOpenActionRefreshModal } = this.props;
    if (actions <= 6) {
      return onOpenActionRefreshModal();
    }
    return history.push('/fate');
  };

  render = () => {
    const { remainingTime } = this.props;

    const duration = moment.duration(remainingTime);
    // TS complains that duration.format is not a function, which it isn't in vanilla moment.js,
    // but we get it by requiring moment-duration-format.
    // @ts-ignore
    const message = `Next in ${duration.format('m:ss', { trim: false })}`;

    return (
      <Fragment>
        <div className="js-icon icon js-tt icon--currency">
          <Image
            className="media__object"
            type="currencies"
            icon="actions"
            alt="actions"
            width={60}
            height={78}
          />
        </div>
        <div className="item__desc">
          <span className="js-item-name item__name">Actions</span>
          <ActionCounter
            message={message}
            onClick={this.handleClick}
          />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  actions: { actions },
  fate: { data: fateData },
  timer: { remainingTime },
}: IAppState) => ({
  actions,
  fateData,
  remainingTime,
});

type Props = ReturnType<typeof mapStateToProps>
  & RouteComponentProps
  & IActionRefreshContextValues;

export default withRouter(connect(mapStateToProps)(
  withActionRefreshContext(ActionCounterContainer),
));