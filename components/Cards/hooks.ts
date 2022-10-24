import { useCallback, useMemo } from "react";

import { draw } from "actions/cards";
import { ICard } from "types/cards";

// eslint-disable-next-line
export const useDrawCards = (dispatch: Function) =>
  useCallback(() => dispatch(draw()), [dispatch]);

export function useHandFull(displayCards: ICard[], handSize: number) {
  return useMemo(
    () => displayCards && displayCards.length === handSize,
    [displayCards, handSize]
  );
}

export function useNoCards(cardsCount: number, isFetching: boolean) {
  return useMemo(
    () => cardsCount === 0 && !isFetching,
    [cardsCount, isFetching]
  );
}

export function useOnClickDeck({
  drawCards,
  handFull,
  isFetching,
  noCards,
  topUpCards,
}: {
  drawCards: () => void;
  handFull: boolean;
  isFetching: boolean;
  noCards: boolean;
  topUpCards: () => void;
}) {
  return useCallback(() => {
    // Do nothing if we're fetching
    if (isFetching) {
      return;
    }
    // If our deck is empty, allow the player to top up
    if (noCards) {
      topUpCards();
      return;
    }

    // If our hand is full, just return
    if (handFull) {
      return;
    }

    // Otherwise, draw cards
    drawCards();
  }, [drawCards, isFetching, handFull, noCards, topUpCards]);
}
