import React, { Fragment } from "react";
import { connect } from "react-redux";
import Storylet from "components/Storylet";
import getNeedsProminentTravelButton from "selectors/map/getNeedsProminentTravelButton";
import { IAppState } from "types/app";
import TravelButton from "components/TravelButton";
import PersistentStoryletContainer from "components/StoryletsAvailable/components/PersistentStoryletContainer";
import { useFeature } from "flagged";
import { FEATURE_PERSISTENT_DECK } from "features/feature-flags";

function StoryletStagger({ needsProminentTravelButton, storylets }: Props) {
  const isPersistentDeckEnabled = useFeature(FEATURE_PERSISTENT_DECK);

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

      {isPersistentDeckEnabled && <PersistentStoryletContainer />}

      {storylets
        .filter(
          (slet) => !isPersistentDeckEnabled || slet.deckType !== "Persistent"
        )
        .map((storylet) => (
          <Storylet key={storylet.id} data={storylet} />
        ))}
    </Fragment>
  );
}

StoryletStagger.displayName = "StoryletStagger";

const mapStateToProps = (state: IAppState) => {
  const { storylet } = state;

  return {
    needsProminentTravelButton: getNeedsProminentTravelButton(state),
    storylets: storylet.storylets,
  };
};

export type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(StoryletStagger);
