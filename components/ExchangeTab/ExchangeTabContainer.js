import React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactCSSTransitionReplace from 'react-css-transition-replace';

import GeneralContainer from 'components/GeneralContainer';
import ExchangeContainer from 'components/Exchange';

function ExchangeTabContainer({ isFetching }) {
  return (
    <GeneralContainer loading={isFetching}>
      <ReactCSSTransitionReplace transitionName="fade-wait" transitionEnterTimeout={100} transitionLeaveTimeout={100}>
        <ExchangeContainer />
      </ReactCSSTransitionReplace>
    </GeneralContainer>
  );
}

ExchangeTabContainer.displayName = 'ExchangeTabContainer';

ExchangeTabContainer.propTypes = {
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ exchange: { isFetching } }) => ({ isFetching });

export default connect(mapStateToProps)(ExchangeTabContainer);
