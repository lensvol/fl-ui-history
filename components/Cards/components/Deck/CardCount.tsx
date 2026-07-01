import React from "react";

import Loading from "components/Loading";

import { useAppSelector } from "features/app/store";

export default function CardCount() {
  const isFetching = useAppSelector((state) => state.cards.isFetching);
  const cardsCount = useAppSelector((state) => state.cards.cardsCount);
  const deckSize = useAppSelector((state) => state.cards.deckSize);

  if (isFetching) {
    return <Loading spinner small />;
  }

  if (cardsCount > deckSize) {
    // no draw limit
    return <span aria-label="No draw limit.">&infin;</span>;
  }

  if (cardsCount === 0) {
    // zero cards; omit badge
    return (
      <span aria-label="No cards waiting." className="u-visually-hidden" />
    );
  }

  if (cardsCount === 1) {
    // one card; omit badge
    return (
      <span
        aria-label="There is 1 card in your Opportunity Deck."
        className="u-visually-hidden"
      />
    );
  }

  return (
    <span
      aria-label={`There are ${cardsCount} cards in your Opportunity Deck.`}
    >
      x{cardsCount}
    </span>
  );
}

CardCount.displayName = "CardCount";
