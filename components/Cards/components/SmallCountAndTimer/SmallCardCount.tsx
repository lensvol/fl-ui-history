import React, { Fragment, useMemo } from "react";

import CardTimer from "components/Cards/components/CardTimer";
import { useHandFull } from "components/Cards/hooks";

import { useAppSelector } from "features/app/store";

export default function SmallCardCount() {
  const cardsCount = useAppSelector((state) => state.cards.cardsCount);
  const displayCards = useAppSelector((state) => state.cards.displayCards);
  const deckSize = useAppSelector((state) => state.cards.deckSize);
  const handSize = useAppSelector((state) => state.cards.handSize);
  const isHandFull = useHandFull(displayCards, handSize);

  const handFullFragment = useMemo(
    () => (
      <p>
        Your hand is full; you must play or discard a card before you can draw
        another.
      </p>
    ),
    []
  );

  if (cardsCount > deckSize) {
    return <>No draw limit. {isHandFull && handFullFragment}</>;
  }

  if (cardsCount === 0) {
    return (
      <Fragment>
        <p>
          No cards waiting. <CardTimer formatter={(str) => `(${str}.)`} />
        </p>
      </Fragment>
    );
  }

  if (cardsCount === 1) {
    return (
      <Fragment>
        <p>
          There is 1 card in your Opportunity Deck.{" "}
          <CardTimer formatter={(str) => `(${str}.)`} />
        </p>
      </Fragment>
    );
  }

  return (
    <>
      <p>
        {`There are ${cardsCount} cards in your Opportunity Deck.`}{" "}
        <CardTimer formatter={(str) => `(${str}.)`} />
      </p>{" "}
      {isHandFull && handFullFragment}
    </>
  );
}

SmallCardCount.displayName = "SmallCardCount";
