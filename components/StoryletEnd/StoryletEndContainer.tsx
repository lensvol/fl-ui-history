import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { goOnwards, tryAgain } from "actions/storylet";
import Loading from "components/Loading";

import StoryletEndComponent from "./StoryletEndComponent";
import { IAppState } from "types/app";

interface Props extends RouteComponentProps {
  dispatch: Function;
  endStorylet: any;
  messages?: any;
}

interface State {
  isTryingAgain: boolean;
  isGoingOnwards: boolean;
}

export class StoryletEndContainer extends Component<Props, State> {
  static displayName = "StoryletEndContainer";

  mounted = false;

  state = {
    isTryingAgain: false,
    isGoingOnwards: false,
  };

  componentDidMount = () => {
    // We're mounted
    this.mounted = true;
  };

  componentWillUnmount = () => {
    // Unmount us
    this.mounted = false;
  };

  /**
   * Handle 'Onwards' click
   * @return {[type]} [description]
   */
  handleOnwardsClick = async () => {
    const { dispatch, history, endStorylet } = this.props;
    const {
      event: { isInEventUseTree },
      isLinkingEvent,
    } = endStorylet;

    // Disable buttons
    this.setState({ isGoingOnwards: true });

    // Fetch stuff that has changed
    // await this.fetchChangedStuff();
    await dispatch(goOnwards());

    // If still mounted, reset component state
    this.resetStateIfMounted();

    // If we got here by using an item, then take us back to the possessions tab...
    // unless we are in a `LinkingEvent` storylet end, in which case we need to
    // stay on the storylet tab for the next part. We need to check this here, before
    // dispatching changes to the storylet state
    const shouldReturnToPossessionsTab = isInEventUseTree && !isLinkingEvent;
    if (shouldReturnToPossessionsTab) {
      history.push("/possessions");
    }
  };

  /**
   * Try again
   * @return {undefined}
   */
  handleTryAgainClick = async () => {
    const {
      dispatch,
      endStorylet: { rootEventId },
    } = this.props;

    // We're trying again; disable buttons
    this.setState({ isTryingAgain: true });

    // Dispatch the action and wait for the results
    await dispatch(tryAgain(rootEventId));

    // If we are still mounted when the try again finishes, then
    // we need to reset button state
    this.resetStateIfMounted();
  };

  resetStateIfMounted = () => {
    if (this.mounted) {
      this.setState({
        isGoingOnwards: false,
        isTryingAgain: false,
      });
    }
  };

  /**
   * Render
   * @return {Object}
   */
  render() {
    const { endStorylet, messages } = this.props;
    const { isTryingAgain, isGoingOnwards } = this.state;

    if (!endStorylet) {
      return <Loading />;
    }

    const { accessCode, canGoAgain, event, rootEventId } = endStorylet;
    const disabled = isTryingAgain || isGoingOnwards;

    return (
      <StoryletEndComponent
        accessCode={accessCode}
        canGoAgain={canGoAgain}
        disabled={disabled}
        event={event}
        isGoingOnwards={isGoingOnwards}
        isTryingAgain={isTryingAgain}
        messages={messages}
        onGoOnwards={this.handleOnwardsClick}
        onTryAgain={this.handleTryAgainClick}
        rootEventId={rootEventId}
      />
    );
  }
}

const mapStateToProps = ({
  storylet: { endStorylet, messages },
}: IAppState) => ({
  messages,
  endStorylet: endStorylet!,
});

export default withRouter(connect(mapStateToProps)(StoryletEndContainer));
