import React, { useMemo } from "react";

import moment from "moment";

// This import is how we set up moment to support formatting durations. Yes, it's weird!
// noinspection ES6UnusedImports
import momentDurationFormatSetup from "moment-duration-format"; // eslint-disable-line @typescript-eslint/no-unused-vars

import { useAppSelector } from "features/app/store";

type Props = {
  formatter?: (arg: any) => string;
};

export default function CardTimer({ formatter: nullableFormatter }: Props) {
  const cardsCount = useAppSelector((state) => state.cards.cardsCount);
  const deckSize = useAppSelector((state) => state.cards.deckSize);
  const remainingTime = useAppSelector((state) => state.timer.remainingTime);

  const formatter = useMemo(() => {
    return nullableFormatter ?? ((x: any) => x);
  }, [nullableFormatter]);

  if (cardsCount >= deckSize) {
    return null;
  }

  // TODO: this is the same code as in ActionCounterContainer; we should extract and share it between both components
  const duration = moment.duration(remainingTime);

  // We can't avoid TS complaining about duration.format not existing, because it hasn't
  // picked up on the 'moment-duration-format' setup.
  // eslint-disable-next-line
  // @ts-ignore
  const message = `Next in ${duration.format("m:ss", { trim: false })}`;

  return <span>{formatter(message)}</span>;
}

CardTimer.displayName = "CardTimer";
