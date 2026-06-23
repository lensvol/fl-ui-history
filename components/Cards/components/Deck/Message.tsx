import React from "react";

import Loading from "components/Loading";

import { useAppSelector } from "features/app/store";

export default function Message() {
  const cards = useAppSelector((state) => state.cards);

  const noDrawLimit = cards.cardsCount > cards.deckSize;
  const noCards = cards.cardsCount === 0;

  if (cards.isFetching) {
    return <Loading spinner small />;
  }

  if (noDrawLimit) {
    return <span>No draw limit.</span>;
  }

  if (noCards) {
    return <span>No cards waiting.</span>;
  }

  if (cards.cardsCount === 1) {
    return <span>1 card waiting!</span>;
  }

  return <span>{`${cards.cardsCount} cards waiting!`}</span>;
}

Message.displayName = "Message";
