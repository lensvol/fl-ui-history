import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchAccessCode } from 'actions/accessCodes';

import StoryTabContent from 'components/StoryTabContent';
import AccessCodeLogin from './AccessCodeLogin';
import AccessCodeChallengeDialog from './AccessCodeChallengeDialog';
import AccessCodeResultDialog from './AccessCodeResultDialog';

// Re-export these components so that they can be imported directly from components/AccessCode
export {
  AccessCodeChallengeDialog,
  AccessCodeResultDialog,
};

class AccessCodeContainer extends Component {
  /**
   * Component Did Mount
   * @return {undefined}
   */
  componentDidMount = async () => {
    // Fetch the access code info
    const { dispatch, history, match } = this.props;
    const data = await dispatch(fetchAccessCode(match.params.accessCodeName, history));
    if (data.isSuccess) {
      // We successfully fetched a valid access code; nothing left for us to do
      return;
    }
    // This wasn't a valid access code; redirect to root
    history.push('/');
  };

  render() {
    const {
      isFetching,
      loggedIn,
    } = this.props;

    // If we're fetching an access code, don't render anything
    if (isFetching) {
      return null;
    }

    // If we're logged in, render story tab content
    if (loggedIn) {
      return <StoryTabContent />;
    }

    // If we're not logged in, render the login page with the challenge message
    return <AccessCodeLogin />;
  }
}

AccessCodeContainer.displayName = 'AccessCodeContainer';

AccessCodeContainer.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = ({
  accessCodes: { accessCode, isFetching },
  user: { loggedIn },
}) => ({
  accessCode,
  isFetching,
  loggedIn,
});

export default withRouter(connect(mapStateToProps)(AccessCodeContainer));