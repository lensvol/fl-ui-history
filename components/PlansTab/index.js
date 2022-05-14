import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as PlansActionCreators from 'actions/plans';

import Plans from 'components/Plans';
import GeneralContainer from 'components/GeneralContainer';

class PlansContainer extends React.Component {
  /**
   * Component Did Mount
   * @return {undefined}
   */
  componentDidMount = () => {
    const { dispatch, firstFetchHasOccurred } = this.props;
    if (!firstFetchHasOccurred) {
      dispatch(PlansActionCreators.fetchPlans());
    }
  }

  /**
   * Render
   * @return {Object}
   */
  render() {
    return (
      <GeneralContainer>
        <Plans />
      </GeneralContainer>
    );
  }
}

PlansContainer.displayName = 'PlansContainer';

PlansContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  firstFetchHasOccurred: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ plans: { firstFetchHasOccurred } }) => ({ firstFetchHasOccurred });

export default connect(mapStateToProps)(PlansContainer);