import React, { useMemo } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import CardCount from "components/Cards/components/Deck/CardCount";
import Timer from "components/Cards/components/Deck/Timer";
import {
  useDrawCards,
  useHandFull,
  useNoCards,
  useOnClickDeck,
} from "components/Cards/hooks";
import { DeckRefreshContextValue } from "components/DeckRefreshContext";

import { useAppSelector } from "features/app/store";

export const DECK_IMAGE_URLS = {
  default: "//images.fallenlondon.com/cards/deck.png",
  disabled: "//images.fallenlondon.com/cards/deck-disabled.png",
  empty: "//images.fallenlondon.com/cards/refill-deck-for-nex.png",
};

type Props = DeckRefreshContextValue;

export default function Deck({ onOpenDeckRefreshModal }: Props) {
  const cardsCount = useAppSelector((state) => state.cards.cardsCount);
  const displayCards = useAppSelector((state) => state.cards.displayCards);
  const handSize = useAppSelector((state) => state.cards.handSize);
  const isFetching = useAppSelector((state) => state.cards.isFetching);

  const handFull = useHandFull(displayCards, handSize);
  const noCards = useNoCards(cardsCount, isFetching);

  const dispatch = useDispatch();
  const drawCards = useDrawCards(dispatch);

  const imageUrl = useMemo(() => {
    if (noCards) {
      return DECK_IMAGE_URLS.empty;
    }

    if (handFull) {
      return DECK_IMAGE_URLS.disabled;
    }

    return DECK_IMAGE_URLS.default;
  }, [handFull, noCards]);

  const onClick = useOnClickDeck({
    drawCards,
    handFull,
    isFetching,
    noCards,
    topUpCards: onOpenDeckRefreshModal,
  });

  const accessibleButtonText = useMemo(() => {
    if (isFetching) {
      return "Loading...";
    }

    if (handFull && !noCards) {
      return "Your hand is full.";
    }

    if (noCards) {
      return "Your deck is empty.";
    }

    return "Click to draw a card from your opportunity deck.";
  }, [handFull, isFetching, noCards]);

  return (
    <div
      className={classnames(
        "deck-container",
        cardsCount === 2 && "deck-container-two-cards",
        cardsCount > 2 && "deck-container-many-cards"
      )}
    >
      <button
        className={classnames(
          "deck",
          isFetching && "deck--fetching",
          handFull && !noCards && "deck--full",
          noCards && "deck--empty",
          !noCards && cardsCount === 1 && "deck-one-card",
          !noCards && cardsCount === 2 && "deck-two-cards",
          !noCards && cardsCount > 2 && "deck-many-cards"
        )}
        onClick={onClick}
        type="button"
      >
        {cardsCount > 2 && (
          <img
            alt=""
            aria-hidden="true"
            className="deck-third-card"
            src={imageUrl}
          />
        )}

        {cardsCount > 1 && (
          <img
            alt=""
            aria-hidden="true"
            className="deck-second-card"
            src={imageUrl}
          />
        )}

        <img
          alt="Opportunity deck"
          className={classnames(
            "deck__image",
            handFull && !noCards && "deck__image--disabled"
          )}
          src={imageUrl}
        />

        <span className="u-visually-hidden">{accessibleButtonText}</span>
      </button>

      <div className="deck-info">
        <div className="deck-info__cards-in-deck">
          <CardCount />
        </div>

        <div className="deck-info__timer">
          <Timer />
        </div>
      </div>
    </div>
  );
}

Deck.displayName = "Deck";
