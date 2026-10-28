import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { hideMap } from "actions/map";
import { setTab } from "actions/subtabs";

import Cards from "components/Cards";
import SmallCards from "components/Cards/components/SmallCards";
import Loading from "components/Loading";
import MediaLgDown from "components/Responsive/MediaLgDown";
import MediaMdUp from "components/Responsive/MediaMdUp";
import MediaSmDown from "components/Responsive/MediaSmDown";
import StoryletInnerTabs from "components/StoryletsAvailable/components/StoryletInnerTabs";
import StoryletStagger from "components/StoryletsAvailable/components/StoryletStagger";
import WelcomeAndTravel from "components/StoryletsAvailable/components/WelcomeAndTravel";

import { useAppSelector } from "features/app/store";

import { SOMETIMES, StoryletActiveTab } from "types/subtabs";

export default function StoryletsAvailableContainer() {
  const dispatch = useDispatch();

  const isMapVisible = useAppSelector((state) => state.map.isVisible);
  const showOps = useAppSelector((state) => state.map.showOps);
  const storylets = useAppSelector((state) => state.storylet.storylets);
  const subtab = useAppSelector((state) => state.subtabs.storylet);

  const onTabSwitch = useCallback(
    (subtab: StoryletActiveTab) => {
      dispatch(
        setTab({
          tab: "storylet",
          subtab,
        })
      );

      // If we're switching to the 'sometimes' subtab, then hide the map
      if (subtab === "sometimes" && isMapVisible) {
        dispatch(hideMap());
      }
    },
    [dispatch, isMapVisible]
  );

  if (!storylets) {
    return <Loading spinner />;
  }

  return (
    <>
      <MediaLgDown>
        <MediaMdUp>
          <WelcomeAndTravel />
        </MediaMdUp>
      </MediaLgDown>

      <MediaSmDown>
        {showOps && (
          <StoryletInnerTabs activeTab={subtab} onChange={onTabSwitch} />
        )}

        {subtab === SOMETIMES ? <SmallCards /> : <StoryletStagger />}
      </MediaSmDown>

      <MediaMdUp>
        <Cards />

        <StoryletStagger />
      </MediaMdUp>
    </>
  );
}

StoryletsAvailableContainer.displayName = "StoryletsAvailableContainer";
