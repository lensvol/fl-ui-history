import React from 'react';
import SecondChance from 'components/Branch/SecondChance';
import { IChallenge } from "types/storylet";

interface Props {
  data : IChallenge,
  locked: boolean,
  toggleSecondChance: any,
}

export default function MaybeSecondChance({ data, locked, toggleSecondChance }: Props) {
  const { canAffordSecondChance, secondChanceDescription } = data;
  // If we have enough second chances, return a toggler
  if (canAffordSecondChance) {
    return <SecondChance data={data} toggleSecondChance={toggleSecondChance} locked={locked} />;
  }
  // Otherwise, return a 'You need...' message (or nothing, if there's no secondChangeDescription)
  return <em dangerouslySetInnerHTML={{ __html: secondChanceDescription }} />;
}

MaybeSecondChance.displayName = 'MaybeSecondChance';
