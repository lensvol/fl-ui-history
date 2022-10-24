import React from "react";
import PropTypes from "prop-types";
import ReactCSSTransitionReplace from "react-css-transition-replace";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchOutfit } from "actions/outfit";

import Loading from "components/Loading";

import Possessions from "components/Possessions";
import GeneralContainer from "components/GeneralContainer";

class PossessionsContainer extends React.Component {
  /**
   * Component Did Mount
   * @return {undefined}
   */
  componentDidMount = () => {
    const { dispatch, isFetching, character } = this.props;
    // If we're waiting for data, then don't re-fetch
    if (isFetching) {
      return;
    }
    if (!character) {
      dispatch(fetchOutfit());
    }
  };

  /**
   * Render
   * @return {Object}
   */
  render() {
    const { isFetching } = this.props;

    return (
      <GeneralContainer sectionName="possessions">
        <ReactCSSTransitionReplace
          transitionName="fade-wait"
          transitionEnterTimeout={100}
          transitionLeaveTimeout={100}
        >
          {isFetching ? (
            <Loading key="loading" />
          ) : (
            <Possessions key="possessions" />
          )}
        </ReactCSSTransitionReplace>
      </GeneralContainer>
    );
  }
}

PossessionsContainer.displayName = "PossessionsContainer";

PossessionsContainer.propTypes = {
  character: PropTypes.shape({}),
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

PossessionsContainer.defaultProps = {
  character: undefined,
};

const mapStateToProps = ({ myself: { character, isFetching } }) => ({
  character,
  isFetching,
});

export default withRouter(connect(mapStateToProps)(PossessionsContainer));
