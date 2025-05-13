import React from "react";

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
    <>
      <StoryletRoot
        data={storylet}
        rootEventId={storylet.id}
        shareData={storylet}
        onGoBack={onGoBack}
      />

      {branches.map((branch) => (
        <Branch
          key={branch.id}
          branch={branch}
          defaultCursor
          isGoingBack={isGoingBack}
          storyletDeckType={storylet.deckType}
        />
      ))}

      <div className="buttons buttons--left buttons--storylet-exit-options">
        <GoBack
          disabled={isChoosing}
          isGoingBack={isGoingBack}
          onClick={onGoBack}
          storylet={storylet}
        />
      </div>
    </>
  );
}

StoryletInComponent.displayName = "StoryletInComponent";
