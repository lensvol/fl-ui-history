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
    return <span>No draw limit.</span>;
  }

  if (cardsCount === 0) {
    // zero cards; omit badge
    return <span>No cards waiting.</span>;
  }

  if (cardsCount === 1) {
    // one card; omit badge
    return <span>1 card waiting!</span>;
  }

  return <span>{`${cardsCount} cards waiting!`}</span>;
}

CardCount.displayName = "CardCount";
