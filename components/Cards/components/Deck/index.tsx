import React, { useCallback, useMemo } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { draw } from "actions/cards";

import Message from "components/Cards/components/Deck/Message";
import Timer from "components/Cards/components/Deck/Timer";
import {
  useHandFull,
  useNoCards,
  useOnClickDeck,
} from "components/Cards/hooks";
import { DeckRefreshContextValue } from "components/DeckRefreshContext";

import { useAppSelector } from "features/app/store";

const DECK_IMAGE_URLS = {
  default: "//images.fallenlondon.com/cards/deck.png",
  disabled: "//images.fallenlondon.com/cards/deck-disabled.png",
  empty: "//images.fallenlondon.com/cards/refill-deck-for-nex.png",
};

type Props = DeckRefreshContextValue;

export default function Deck({ onOpenDeckRefreshModal }: Props) {
  const cards = useAppSelector((state) => state.cards);
  const handFull = useHandFull(cards.displayCards, cards.handSize);
  const noCards = useNoCards(cards.cardsCount, cards.isFetching);

  const dispatch = useDispatch();

  const drawCards = useCallback(() => {
    dispatch(draw());
  }, [dispatch]);

  const imageUrl = useMemo(() => {
    if (noCards) {
      return DECK_IMAGE_URLS.empty;
    }

    if (handFull) {
      return DECK_IMAGE_URLS.disabled;
    }

    return DECK_IMAGE_URLS.default;
  }, [handFull, noCards]);

  const topUpCards = useCallback(() => {
    return onOpenDeckRefreshModal();
  }, [onOpenDeckRefreshModal]);

  const onClick = useOnClickDeck({
    drawCards,
    handFull,
    isFetching: cards.isFetching,
    noCards,
    topUpCards,
  });

  const deckClassName = classnames(
    "deck",
    cards.isFetching && "deck--fetching",
    handFull && !noCards && "deck--full",
    noCards && "deck--empty"
  );

  const imageClassName = classnames(
    "deck__image",
    handFull && !noCards && "deck__image--disabled"
  );

  const accessibleButtonText = useMemo(() => {
    if (cards.isFetching) {
      return "Loading...";
    }

    if (handFull && !noCards) {
      return "Your hand is full.";
    }

    if (noCards) {
      return "Your deck is empty.";
    }

    return "Click to draw a card from your opportunity deck.";
  }, [cards, handFull, noCards]);

  return (
    <div className="deck-container">
      <button className={deckClassName} onClick={onClick} type="button">
        <img alt="Opportunity deck" className={imageClassName} src={imageUrl} />

        <span className="u-visually-hidden">{accessibleButtonText}</span>
      </button>

      <div className="deck-info">
        <div className="deck-info__cards-in-deck">
          <Message />
        </div>

        <div className="deck-info__timer">
          <Timer />
        </div>
      </div>
    </div>
  );
}

Deck.displayName = "Deck";
