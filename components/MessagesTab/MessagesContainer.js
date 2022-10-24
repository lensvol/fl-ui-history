import React from "react";
import PropTypes from "prop-types";
import ReactCSSTransitionReplace from "react-css-transition-replace";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as MessagesActionCreators from "actions/messages";
import Loading from "components/Loading";
import Messages from "components/Messages";
import GeneralContainer from "components/GeneralContainer";

class MessagesContainer extends React.Component {
  /**
   * [componentDidMount description]
   * @return {[type]} [description]
   */
  componentDidMount = () => {
    const { dispatch, feedMessages, interactions, isFetching } = this.props;

    if (isFetching) {
      return;
    }

    // this.props.dispatch(MessagesActionCreators.fetchFeedMessages());
    // this.props.dispatch(MessagesActionCreators.fetch('interactions'));

    // If we aren't fetching, and we don't have the expected state shape,
    // then fetch messages
    if (!feedMessages.length && !interactions.length) {
      dispatch(MessagesActionCreators.fetch());
    }
  };

  /**
   * Render
   * @return {Object}
   */
  render() {
    const { isFetching } = this.props;
    return (
      <GeneralContainer loading={isFetching}>
        <ReactCSSTransitionReplace
          transitionName="fade-wait"
          transitionEnterTimeout={100}
          transitionLeaveTimeout={100}
        >
          {isFetching ? <Loading key="loading" /> : <Messages key="messages" />}
        </ReactCSSTransitionReplace>
      </GeneralContainer>
    );
  }
}

MessagesContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  feedMessages: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  interactions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = ({
  messages: { feedMessages, interactions, isFetching },
}) => ({
  feedMessages,
  interactions,
  isFetching,
});

export default withRouter(connect(mapStateToProps)(MessagesContainer));
