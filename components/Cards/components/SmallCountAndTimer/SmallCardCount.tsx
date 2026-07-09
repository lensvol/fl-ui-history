import React from "react";

import { useAppSelector } from "features/app/store";

export default function SmallCardCount() {
  const cardsCount = useAppSelector((state) => state.cards.cardsCount);
  const deckSize = useAppSelector((state) => state.cards.deckSize);

  if (cardsCount > deckSize) {
    return <span aria-label="No draw limit.">No draw limit.</span>;
  }

  if (cardsCount === 0) {
    return <span aria-label="No cards waiting.">No cards waiting.</span>;
  }

  if (cardsCount === 1) {
    return (
      <span aria-label="There is 1 card in your Opportunity Deck.">
        There is 1 card in your Opportunity Deck.
      </span>
    );
  }

  return (
    <span
      aria-label={`There are ${cardsCount} cards in your Opportunity Deck.`}
    >
      There are {cardsCount} cards in your Opportunity Deck.
    </span>
  );
}

SmallCardCount.displayName = "SmallCardCount";
