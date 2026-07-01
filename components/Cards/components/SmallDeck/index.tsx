import React, { useMemo } from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

import { DECK_IMAGE_URLS } from "components/Cards/components/Deck";
import CardCount from "components/Cards/components/Deck/CardCount";
import {
  useDrawCards,
  useHandFull,
  useNoCards,
  useOnClickDeck,
} from "components/Cards/hooks";

import { useAppSelector } from "features/app/store";

type Props = {
  onOpenDeckRefreshModal: () => void;
};

export default function SmallDeckContainer({ onOpenDeckRefreshModal }: Props) {
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
        disabled={handFull}
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

        <div className="deck-info__cards-in-deck">
          <CardCount />
        </div>
      </button>
    </div>
  );
}

SmallDeckContainer.displayName = "SmallDeckContainer";
