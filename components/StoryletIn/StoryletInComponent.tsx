import React, { Fragment } from "react";

import StoryletRoot from "components/StoryletRoot";
import Branch from "components/Branch";
import GoBack from "components/StoryletIn/GoBack";
import { IBranch, IStorylet } from "types/storylet";

interface Props {
  branches: IBranch[];
  isChoosing: boolean;
  isGoingBack: boolean;
  onGoBack: () => {};
  storylet: IStorylet;
}

export default function StoryletInComponent({
  branches,
  isChoosing,
  isGoingBack,
  onGoBack,
  storylet,
}: Props) {
  // If we have no storylet here, it's probably because we just changed outfits;
  // return null and let our parent fetch them
  if (!storylet) {
    return null;
  }

  return (
    <Fragment>
      <StoryletRoot
        data={storylet}
        shareData={storylet}
        rootEventId={storylet.id}
      />
      {branches.map((branch) => (
        <Branch
          key={branch.id}
          branch={branch}
          storyletDeckType={storylet.deckType}
          isGoingBack={isGoingBack}
          defaultCursor
        />
      ))}
      <div className="buttons buttons--left buttons--storylet-exit-options">
        <GoBack
          disabled={isChoosing}
          onClick={onGoBack}
          storylet={storylet}
          isGoingBack={isGoingBack}
        />
      </div>
    </Fragment>
  );
}

StoryletInComponent.displayName = "StoryletInComponent";
