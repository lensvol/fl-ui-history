import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { fetchActions } from "actions/actions";
import { fetch as fetchCards } from "actions/cards";
import { fetch as fetchMessages } from "actions/messages";
import { setRemaining } from "actions/timer";

import { MESSAGE_POLL_INTERVAL, TICK_RATE } from "constants/timer";

export class Timer extends Component {
  componentDidMount() {
    // Update action timer
    this.interval = setInterval(this.onTick, TICK_RATE);

    // Poll /messages for new messages
    this.messageInterval = setInterval(
      this.pollMessages,
      MESSAGE_POLL_INTERVAL
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.messageInterval);
  }

  getRemainingTime = () => {
    const {
      timer: { timeNextActionIsAvailable },
    } = this.props;
    const now = new Date();
    return new Date(timeNextActionIsAvailable) - now;
  };

  pollMessages = () => {
    if (!this.shouldRenewCharacterData()) {
      return;
    }
    const { dispatch } = this.props;
    dispatch(fetchMessages());
  };

  shouldRenewCharacterData = () => {
    const { isClientOutdated, user } = this.props;

    // If we're out of date, don't update cards/actions
    if (isClientOutdated) {
      return false;
    }

    // Are we logged in, and do we have a character?
    return (
      user && user.loggedIn && user.hasCharacter && user.user && user.user.id
    );
  };

  onTick = () => {
    const {
      actions: { error },
      dispatch,
    } = this.props;

    // Compute remaining time
    const remainingTime = this.getRemainingTime();
    dispatch(setRemaining(remainingTime));

    // If we experienced an error fetching actions, then return out
    if (error) {
      return;
    }

    // If we aren't logged in, with a character and a user ID,
    // or if the client is out of date, then return
    if (!this.shouldRenewCharacterData()) {
      return;
    }

    // If we're overdue for a refresh, then perform one
    if (remainingTime < 0) {
      // Refresh actions
      this.renewActions();
      // Refresh the opportunity deck
      this.renewCards();
    }
  };

  renewActions = () => {
    const { dispatch, actions } = this.props;
    if (!actions) {
      return;
    }

    // If we're in the middle of fetching the sidebar, or if our
    // actions are full, don't initiate a new fetch
    if (actions.isFetching || actions.actions === actions.actionBankSize) {
      return;
    }

    // If we have fewer than our maximum bankable actions, then get new action data
    if (actions.actions < actions.actionBankSize) {
      // Fetch actions
      dispatch(fetchActions());
    }
  };

  renewCards = () => {
    const { cards, dispatch } = this.props;
    // If we're in the middle of fetching cards, don't initiate
    // a new fetch
    if (cards.isFetching || cards.isFetchingInBackground) {
      return;
    }

    // If our deck isn't full, then fetch cards
    if (cards.cardsCount !== cards.deckSize) {
      dispatch(fetchCards({ background: true, preventMove: true }));
    }
  };

  // We're not rendering anything for this component, just keeping it
  // running in the background
  render() {
    const {
      actions: { error },
    } = this.props;
    // Throw on render if we have an error (this stops runaway request creation)
    if (error) {
      if (error.message === "Network Error") {
        return null;
      }
      throw error;
    }
    return null;
  }
}

Timer.displayName = "Timer";

Timer.propTypes = {
  actions: PropTypes.shape({
    error: PropTypes.shape({}),
    isFetching: PropTypes.bool.isRequired,
  }).isRequired,
  cards: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
    isFetchingInBackground: PropTypes.bool.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  isClientOutdated: PropTypes.bool.isRequired,
  timer: PropTypes.shape({
    timeNextActionIsAvailable: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({}).isRequired,
};

export const mapStateToProps = ({
  actions,
  cards,
  timer,
  user,
  versionSync,
}) => ({
  actions,
  cards,
  timer,
  user,
  isClientOutdated: versionSync.isClientOutdated,
});

export default connect(mapStateToProps)(Timer);
