import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import { fetchMap } from "actions/map";
import { fetch as fetchSettings } from "actions/settings";
import { fetchAvailable as fetchAvailableStorylets } from "actions/storylet";

import Act from "components/Act";
import DomManipulationContext from "components/DomManipulationContext";
import ExceptionalFriendModal from "components/ExceptionalFriendModal";
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
  IN,
  IN_ITEM_USE,
  RENAME,
  SECOND_CHANCE,
  UNIQUE_ACT_PENDING,
} from "constants/phases";

import { useAppSelector } from "features/app/store";

export default function StoryTabContentContainer() {
  const [isExceptionalFriendModalOpen, setIsExceptionalFriendModalOpen] =
    useState(false);
  const [didLoad, setDidLoad] = useState(false);

  const dispatch = useDispatch();

  const isFetching = useAppSelector((state) => state.storylet.isFetching);
  const phase = useAppSelector((state) => state.storylet.phase);
  const setting = useAppSelector((state) => state.map.setting);
  const socialAct = useAppSelector((state) => state.storylet.socialAct);
  const storylet = useAppSelector((state) => state.storylet.storylet);
  const storylets = useAppSelector((state) => state.storylet.storylets);

  useEffect(() => {
    if (didLoad) {
      return;
    }

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

    setDidLoad(true);
  }, [didLoad, dispatch, isFetching, phase, socialAct, storylet, storylets]);

  const handleOpenSubscriptionModal = useCallback(() => {
    setIsExceptionalFriendModalOpen(true);
  }, []);

  const handleRequestCloseSubscriptionModal = useCallback(
    (didUserSubscribe: boolean) => {
      setIsExceptionalFriendModalOpen(false);

      // If the user subscribed, we need to update storylet and map state
      if (didUserSubscribe) {
        dispatch(fetchAvailableStorylets());
        dispatch(fetchMap());
      }
    },
    [dispatch]
  );

  const renderContent = useMemo(() => {
    if (isFetching) {
      return <Loading />;
    }

    switch (phase) {
      case ACT:
        return <Act />;

      case END:
        return <StoryletEnd />;

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
  }, [isFetching, phase]);

  return (
    <>
      <DomManipulationContext.Provider
        value={{
          onOpenSubscriptionModal: handleOpenSubscriptionModal,
        }}
      >
        <GeneralContainer>{renderContent}</GeneralContainer>
      </DomManipulationContext.Provider>

      <ExceptionalFriendModal
        isOpen={isExceptionalFriendModalOpen}
        onRequestClose={handleRequestCloseSubscriptionModal}
      />

      {setting && setting.canOpenMap && <Map />}
    </>
  );
}

StoryTabContentContainer.displayName = "StoryTabContentContainer";
