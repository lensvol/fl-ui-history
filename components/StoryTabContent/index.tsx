import React from "react";

import { connect } from "react-redux";

import { RouteComponentProps, withRouter } from "react-router-dom";

import { fetch as fetchMap } from "actions/map";
import { fetch as fetchSettings } from "actions/settings";
import { fetchAvailable as fetchAvailableStorylets } from "actions/storylet";

import Act from "components/Act";
import DomManipulationContext from "components/DomManipulationContext";
import ExceptionalFriendModal from "components/ExceptionalFriendModal";
import ExternalAct from "components/ExternalAct";
import GeneralContainer from "components/GeneralContainer";
import Loading from "components/Loading";
import Map from "components/Map";
import Rename from "components/Rename";
import SecondChance from "components/SecondChance";
import StoryletEnd from "components/StoryletEnd/StoryletEndContainer";
import StoryletIn from "components/StoryletIn/StoryletInContainer";
import StoryletsAvailable from "components/StoryletsAvailable";
import UniqueActPending from "components/UniqueActPending";

import {
  ACT,
  AVAILABLE,
  END,
  EXTERNAL_ACT,
  IN,
  IN_ITEM_USE,
  RENAME,
  SECOND_CHANCE,
  UNIQUE_ACT_PENDING,
} from "constants/phases";

import { IAppState } from "types/app";

const mapStateToProps = ({
  map: { setting },
  storylet: { isFetching, phase, socialAct, storylet, storylets },
}: IAppState) => ({
  isFetching,
  phase,
  setting,
  socialAct,
  storylet,
  storylets,
});

interface State {
  isExceptionalFriendModalOpen: boolean;
}

interface Props
  extends ReturnType<typeof mapStateToProps>, RouteComponentProps {
  dispatch: Function; // eslint-disable-line
}

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
      dispatch(fetchSettings());
    }
  };

  handleOpenSubscriptionModal = () => {
    this.setState({ isExceptionalFriendModalOpen: true });
  };

  handleRequestCloseSubscriptionModal = (didUserSubscribe: boolean) => {
    this.setState({
      isExceptionalFriendModalOpen: false,
    });

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
      case ACT:
        return <Act />;

      case END:
        return <StoryletEnd />;

      case EXTERNAL_ACT:
        return <ExternalAct />;

      case IN: // fall-through; these are the same for slet rendering
      case IN_ITEM_USE:
        return <StoryletIn />;

      case RENAME:
        return <Rename />;

      case SECOND_CHANCE:
        return <SecondChance />;

      case AVAILABLE:
        return <StoryletsAvailable />;

      case UNIQUE_ACT_PENDING:
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
      <>
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
      </>
    );
  }
}

export default withRouter(connect(mapStateToProps)(StoryTabContentContainer));
