import React from "react";

import classnames from "classnames";

import Challenge from "components/Branch/Challenge";

import { IChallenge } from "types/storylet";

export interface Props {
  challenges: IChallenge[];
  isAgent?: boolean;
  locked: boolean;
  toggleSecondChance: (_: boolean, __: number) => void;
}

export default function Challenges({
  challenges,
  isAgent,
  locked,
  toggleSecondChance,
}: Props) {
  // If we have no challenges for this branch, then don't render anything
  if (!challenges.length) {
    return null;
  }

  // Render the container and challenges
  return (
    <div className={classnames("challenges", locked && "challenges--locked")}>
      {challenges.map((challenge) => (
        <Challenge
          key={challenge.id}
          data={challenge}
          isAgent={isAgent ?? false}
          toggleSecondChance={toggleSecondChance}
          locked={locked}
        />
      ))}
    </div>
  );
}

Challenges.displayName = "Challenges";
