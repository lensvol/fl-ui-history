import React, { useCallback, useRef, useState } from "react";

import { useDispatch } from "react-redux";

import { useHistory } from "react-router-dom";

import { actionsUpdated } from "actions/actions";
import { processMessages } from "actions/app";
import { fetch as fetchCards } from "actions/cards";
import { fetchAvailableSuccess, goBackSuccess } from "actions/storylet";
import { handleVersionMismatch } from "actions/versionSync";

import StoryletInComponent from "components/StoryletIn/StoryletInComponent";

import { AVAILABLE, IN_ITEM_USE } from "constants/phases";

import { useAppSelector } from "features/app/store";

import useIsMounted from "hooks/useIsMounted";

import getSortedBranches from "selectors/storylet/getSortedBranches";

import { VersionMismatch } from "services/BaseService";
import StoryletService from "services/StoryletService";

export default function StoryletInContainer() {
  const branches = useAppSelector((state) => getSortedBranches(state));
  const isChoosing = useAppSelector((state) => state.storylet.isChoosing);
  const phase = useAppSelector((state) => state.storylet.phase);
  const storylet = useAppSelector((state) => state.storylet.storylet);
  const canChangeOutfit = useAppSelector(
    (state) => state.storylet.canChangeOutfit
  );

  const [isGoingBack, setIsGoingBack] = useState(false);

  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const history = useHistory();
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

      // reset invitation button
      dispatch(
        goBackSuccess({
          actions: undefined,
          canChangeOutfit,
          phase: nextPhase,
        })
      );

      // If there are messages, then process them
      if (messages) {
        dispatch(processMessages(messages));
      }

      // If the situation is nominal and we are getting returned to the available storylets,
      // nothing much has changed, so we can take the player back to the Possessions tab
      if (phase === IN_ITEM_USE && nextPhase === AVAILABLE) {
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
  }, [canChangeOutfit, dispatch, history, isMounted, phase]);

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
