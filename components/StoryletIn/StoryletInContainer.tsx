import { handleVersionMismatch } from "actions/versionSync";
import React, { useCallback, useRef, useState } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { actionsUpdated } from "actions/actions";
import { fetch as fetchCards } from "actions/cards";
import { processMessages } from "actions/app";
import { fetchAvailableSuccess } from "actions/storylet";

import useIsMounted from "hooks/useIsMounted";
import { ThunkDispatch } from "redux-thunk";
import { VersionMismatch } from "services/BaseService";
import StoryletService from "services/StoryletService";

import * as phases from "constants/phases";

import getSortedBranches from "selectors/storylet/getSortedBranches";
import { IAppState } from "types/app";

import StoryletInComponent from "./StoryletInComponent";

const mapStateToProps = (state: IAppState) => ({
  branches: getSortedBranches(state),
  isChoosing: state.storylet.isChoosing,
  phase: state.storylet.phase,
  storylet: state.storylet.storylet,
});

type Props = ReturnType<typeof mapStateToProps> &
  RouteComponentProps & { dispatch: ThunkDispatch<any, any, any> };

function StoryletInContainer(props: Props) {
  const { branches, dispatch, history, isChoosing, phase, storylet } = props;

  const [isGoingBack, setIsGoingBack] = useState(false);
  const isMounted = useIsMounted();
  const service = useRef(new StoryletService());

  const goBack = useCallback(async () => {
    try {
      setIsGoingBack(true);

      const { data } = await service.current.goBack();

      // Retrieve opp cards; they may have changed as a result of entering this storylet
      // (e.g. St Arthur's Candle adds a card to your hand)
      dispatch(fetchCards());

      // Update actions
      dispatch(actionsUpdated(data));

      const { messages, phase: nextPhase } = data;

      // Fill state (actions, storylets, etc.)
      dispatch(fetchAvailableSuccess(data));

      // If there are messages, then process them
      if (messages) {
        dispatch(processMessages(messages));
      }

      // If the situation is nominal and we are getting returned to the available storylets,
      // nothing much has changed, so we can take the player back to the Possessions tab
      if (phase === phases.IN_ITEM_USE && nextPhase === phases.AVAILABLE) {
        history.push("/possessions");
      }

      // If we're still mounted in the 'In' phase, unset isGoingBack
      if (isMounted.current) {
        setIsGoingBack(false);
      }
    } catch (e) {
      if (e instanceof VersionMismatch) {
        dispatch(handleVersionMismatch(e));
        return;
      }
      throw e;
    }
  }, [dispatch, history, isMounted, phase]);

  return (
    <StoryletInComponent
      branches={branches}
      isChoosing={isChoosing}
      isGoingBack={isGoingBack}
      onGoBack={goBack}
      storylet={storylet}
    />
  );
}

StoryletInContainer.displayName = "StoryletInContainer";

export default withRouter(connect(mapStateToProps)(StoryletInContainer));
