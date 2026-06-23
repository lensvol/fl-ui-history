import React from "react";

import { useDispatch } from "react-redux";

import classnames from "classnames";

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

  const dispatch = useDispatch();
  const drawCards = useDrawCards(dispatch);
  const handFull = useHandFull(displayCards, handSize);
  const noCards = useNoCards(cardsCount, isFetching);

  const onClick = useOnClickDeck({
    drawCards,
    handFull,
    isFetching,
    noCards,
    topUpCards: onOpenDeckRefreshModal,
  });

  return (
    <div className="media__body">
      <button
        className={classnames(
          "deck deck--small-media",
          handFull && !noCards && "deck--full",
          noCards && "deck--empty",
          isFetching && "deck--fetching"
        )}
        disabled={handFull}
        onClick={onClick}
        type="button"
      />
    </div>
  );
}

SmallDeckContainer.displayName = "SmallDeckContainer";
