import React, { useEffect } from "react";

import { useDispatch } from "react-redux";

import { fetch as fetchCards } from "actions/cards";

import SmallCardContainer from "components/Cards/components/SmallCardContainer";
import SmallCountAndTimer from "components/Cards/components/SmallCountAndTimer";
import SmallDeck from "components/Cards/components/SmallDeck";
import DeckRefreshContext from "components/DeckRefreshContext";

import { useAppSelector } from "features/app/store";

export default function SmallCards() {
  const cards = useAppSelector((state) => state.cards);

  const dispatch = useDispatch();

  useEffect(() => {
    if (cards.wasInvalidatedByEquipmentChange) {
      dispatch(fetchCards());
    }
  }, [cards, dispatch]);

  return (
    <>
      <div className="opportunity-cards--small">
        <div className="opportunity-cards__left--small">
          <DeckRefreshContext.Consumer>
            {(value) => (
              <SmallDeck
                onOpenDeckRefreshModal={value.onOpenDeckRefreshModal}
              />
            )}
          </DeckRefreshContext.Consumer>
        </div>

        <div className="media__body opportunity-cards__body--small">
          <h2 className="media__heading heading heading--3">
            Opportunity deck
          </h2>
          <SmallCountAndTimer />
        </div>
      </div>

      <h2 className="heading heading--3 small-cards__heading">
        Pick a card from your hand ({cards.displayCards.length}/{cards.handSize}
        )
      </h2>

      <div className="hand hand--small-media">
        {cards.displayCards.map((card) => (
          <SmallCardContainer key={card.eventId} data={card} />
        ))}
      </div>
    </>
  );
}

SmallCards.displayName = "SmallCards";
