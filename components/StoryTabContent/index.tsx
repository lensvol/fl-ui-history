import Act from "components/Act";
import Loading from "components/Loading";
import SecondChance from "components/SecondChance";
import StoryletEnd from "components/StoryletEnd/StoryletEndContainer";
import StoryletIn from "components/StoryletIn/StoryletInContainer";
import StoryletsAvailable from "components/StoryletsAvailable";
import * as phases from "constants/phases";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { fetch as fetchMap } from "actions/map";
import { fetchAvailable as fetchAvailableStorylets } from "actions/storylet";

import DomManipulationContext from "components/DomManipulationContext";
import ExceptionalFriendModal from "components/ExceptionalFriendModal";
import GeneralContainer from "components/GeneralContainer";
import Map from "components/Map";
import { IAppState } from "types/app";
import UniqueActPending from "components/UniqueActPending";
import Rename from "components/Rename";
import ExternalAct from "components/ExternalAct";

class StoryTabContentContainer extends React.Component<Props, State> {
  static displayName = "StoryTabContentContainer";

  state = {
    isExceptionalFriendModalOpen: false,
  };

  componentDidMount = () => {
    const { dispatch, isFetching, phase, socialAct, storylet, storylets } =
      this.props;

    if (isFetching) {
      return;
    }

    const storyletsAreFalsy = !((storylets && storylets.length) || storylet);
    const weNeedToBackOutOfASocialAct = phase === "Act" && !socialAct;

    // If we have falsy values for both 'storylets' and 'storylet', or we have stale social act state,
    if (storyletsAreFalsy || weNeedToBackOutOfASocialAct) {
      dispatch(fetchAvailableStorylets());
    }
  };

  handleOpenSubscriptionModal = () => {
    this.setState({ isExceptionalFriendModalOpen: true });
  };

  handleRequestCloseSubscriptionModal = (didUserSubscribe: boolean) => {
    this.setState({ isExceptionalFriendModalOpen: false });
    const { dispatch } = this.props;
    // If the user subscribed, we need to update storylet and map state
    if (didUserSubscribe) {
      dispatch(fetchAvailableStorylets());
      dispatch(fetchMap());
    }
  };

  renderContent = () => {
    const { isFetching, phase } = this.props;

    if (isFetching) {
      return <Loading />;
    }

    switch (phase) {
      case phases.ACT:
        return <Act />;
      case phases.END:
        return <StoryletEnd />;
      case phases.EXTERNAL_ACT:
        return <ExternalAct />;
      case phases.IN: // fall-through; these are the same for slet rendering
      case phases.IN_ITEM_USE:
        return <StoryletIn />;
      case phases.RENAME:
        return <Rename />;
      case phases.SECOND_CHANCE:
        return <SecondChance />;
      case phases.AVAILABLE:
        return <StoryletsAvailable />;
      case phases.UNIQUE_ACT_PENDING:
        return <UniqueActPending />;
      default: // We don't know what to show
        return null;
    }
  };

  /**
   * Render
   * @return {Object}
   */
  render() {
    const { setting } = this.props;
    const { isExceptionalFriendModalOpen } = this.state;
    return (
      <Fragment>
        <DomManipulationContext.Provider
          value={{
            onOpenSubscriptionModal: this.handleOpenSubscriptionModal,
          }}
        >
          <GeneralContainer>{this.renderContent()}</GeneralContainer>
        </DomManipulationContext.Provider>
        <ExceptionalFriendModal
          isOpen={isExceptionalFriendModalOpen}
          onRequestClose={this.handleRequestCloseSubscriptionModal}
        />
        {setting?.canOpenMap && <Map />}
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  cards: { handSize },
  map: { setting, showOps },
  storylet: { isFetching, phase, socialAct, storylet, storylets },
}: IAppState) => ({
  handSize,
  setting,
  showOps,
  isFetching,
  phase,
  socialAct,
  storylet,
  storylets,
});

export interface Props
  extends ReturnType<typeof mapStateToProps>,
    RouteComponentProps {
  dispatch: Function; // eslint-disable-line
}

export interface State {
  isExceptionalFriendModalOpen: boolean;
}

export default withRouter(connect(mapStateToProps)(StoryTabContentContainer));
