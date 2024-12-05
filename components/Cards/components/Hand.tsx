import React, { useMemo } from "react";

import classnames from "classnames";

import CardContainer from "components/Cards/components/CardContainer";
import Tile from "components/Cards/components/Tile";

import { useAppSelector } from "features/app/store";

export default function Hand() {
  const displayCards = useAppSelector((state) => state.cards.displayCards);
  const handSize = useAppSelector((state) => state.cards.handSize);
  const isFetching = useAppSelector((state) => state.cards.isFetching);

  const cards = useMemo(() => {
    const components = [];

    // Add the cards
    displayCards
      .slice(0, Math.max(handSize, displayCards.length))
      .forEach((card) => {
        components.push(<CardContainer key={card.eventId} data={card} />);
      });

    // Add an empty tile for each empty spot in the player's hand
    for (let i = 0; i < Math.max(handSize - displayCards.length, 0); i += 1) {
      components.push(<Tile key={i} isFetching={isFetching} />);
    }

    return components;
  }, [displayCards, handSize, isFetching]);

  return (
    <div className={classnames("hand", displayCards.length === 5 && "hand--5")}>
      {cards}
    </div>
  );
}

Hand.displayName = "Hand";
