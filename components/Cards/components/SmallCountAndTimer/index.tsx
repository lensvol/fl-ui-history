import React from "react";

import Loading from "components/Loading";
import CardTimer from "components/Cards/components/CardTimer";
import { useHandFull } from "components/Cards/hooks";

import { useAppSelector } from "features/app/store";

export default function SmallCountAndTimer() {
  const isFetching = useAppSelector((state) => state.cards.isFetching);
  const displayCards = useAppSelector((state) => state.cards.displayCards);
  const handSize = useAppSelector((state) => state.cards.handSize);
  const isHandFull = useHandFull(displayCards, handSize);
  const cardsCount = useAppSelector((state) => state.cards.cardsCount);
  const deckSize = useAppSelector((state) => state.cards.deckSize);

  if (isFetching) {
    return <Loading spinner small />;
  }

  return (
    <div>
      <p>
        {cardsCount <= deckSize && <CardTimer formatter={(str) => `${str}.`} />}
      </p>

      {isHandFull && (
        <p>
          Your hand is full; you must play or discard a card before you can draw
          another.
        </p>
      )}
    </div>
  );
}

SmallCountAndTimer.displayName = "SmallCountAndTimer";
