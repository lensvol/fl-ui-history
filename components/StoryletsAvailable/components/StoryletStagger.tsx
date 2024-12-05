import React, { Fragment } from "react";

import Storylet from "components/Storylet";
import PersistentStoryletContainer from "components/StoryletsAvailable/components/PersistentStoryletContainer";
import TravelButton from "components/TravelButton";

import { useAppSelector } from "features/app/store";

import getNeedsProminentTravelButton from "selectors/map/getNeedsProminentTravelButton";

export default function StoryletStagger() {
  const storylets = useAppSelector((state) => state.storylet.storylets);
  const needsProminentTravelButton = useAppSelector((state) =>
    getNeedsProminentTravelButton(state)
  );

  if (storylets === null) {
    return null;
  }

  return (
    <Fragment>
      {needsProminentTravelButton && (
        <div
          className="prominent-travel-button-container"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TravelButton />
        </div>
      )}

      <PersistentStoryletContainer />

      {storylets
        .filter((slet) => slet.deckType !== "Persistent")
        .map((storylet) => (
          <Storylet key={storylet.id} data={storylet} />
        ))}
    </Fragment>
  );
}

StoryletStagger.displayName = "StoryletStagger";
