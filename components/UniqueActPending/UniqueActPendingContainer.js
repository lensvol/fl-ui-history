import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { goBackFromSocialAct } from 'actions/storylet';

import UniqueActPendingComponent from './UniqueActPendingComponent';

export class UniqueActPendingContainer extends Component {
  mounted = false

  state = {
    isGoingBack: false,
  }

  componentDidMount = () => {
    this.mounted = true;
  }

  componentWillUnmount = () => {
    this.mounted = false;
  }

  handleGoBack = async () => {
    const { dispatch } = this.props;
    this.setState({ isGoingBack: true });
    await dispatch(goBackFromSocialAct());
    if (this.mounted) {
      this.setState({ isGoingBack: false });
    }
  }

  render = () => {
    const { branch } = this.props;
    const { isGoingBack } = this.state;
    return (
      <UniqueActPendingComponent
        branch={branch}
        isGoingBack={isGoingBack}
        onGoBack={this.handleGoBack}
      />
    );
  }
}

UniqueActPendingContainer.displayName = 'UniqueActPendingContainer';

UniqueActPendingContainer.propTypes = {
  branch: PropTypes.shape({}).isRequired,
};

const mapStateToProps = ({ storylet: { socialAct: { branch } } }) => ({ branch });

export default connect(mapStateToProps)(UniqueActPendingContainer);