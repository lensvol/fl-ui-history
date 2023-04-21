import React from "react";
import SecondChance from "components/Branch/SecondChance";
import { IChallenge } from "types/storylet";
import classnames from "classnames";

interface Props {
  data: IChallenge;
  locked: boolean;
  toggleSecondChance: any;
}

export default function MaybeSecondChance({
  data,
  locked,
  toggleSecondChance,
}: Props) {
  const { canAffordSecondChance, secondChanceDescription } = data;
  // If we have enough second chances, return a toggler
  if (canAffordSecondChance) {
    return (
      <SecondChance
        data={data}
        toggleSecondChance={toggleSecondChance}
        locked={locked}
      />
    );
  }

  // Return a 'You need...' message, when we have one
  if (secondChanceDescription) {
    return (
      <>
        <div
          className={classnames(
            "second-chance",
            locked && "second-chance--locked"
          )}
        >
          <em dangerouslySetInnerHTML={{ __html: secondChanceDescription }} />
        </div>
      </>
    );
  }

  // Otherwise, return nothing, as there's no secondChanceDescription
  return <></>;
}

MaybeSecondChance.displayName = "MaybeSecondChance";
