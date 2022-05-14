import React, { useCallback, useMemo } from 'react';
import { draw } from 'actions/cards';
import classnames from 'classnames';

import {
  connect,
  useDispatch,
} from 'react-redux';
import { IAppState } from 'types/app';
import { useHandFull, useNoCards, useOnClickDeck } from 'components/Cards/hooks';
import { DeckRefreshContextValue } from 'components/DeckRefreshContext';
import Message from './Message';
import Timer from './Timer';

const DECK_IMAGE_URLS = {
  default: '//images.fallenlondon.com/cards/deck.png',
  disabled: '//images.fallenlondon.com/cards/deck-disabled.png',
  empty: '//images.fallenlondon.com/cards/refill-deck-for-nex.png',
};

function Deck({
  cardsCount,
  displayCards,
  handSize,
  isFetching,
  onOpenDeckRefreshModal,
}: Props) {
  const dispatch = useDispatch();

  const handFull = useHandFull(displayCards, handSize);

  const noCards = useNoCards(cardsCount, isFetching);

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

  const topUpCards = useCallback(() => onOpenDeckRefreshModal(), [onOpenDeckRefreshModal]);

  const onClick = useOnClickDeck({
    drawCards,
    handFull,
    isFetching,
    noCards,
    topUpCards,
  });

  const imageSrc = imageUrl;

  const deckClassName = classnames(
    'deck',
    isFetching && 'deck--fetching',
    handFull && !noCards && 'deck--full',
    noCards && 'deck--empty',
  );

  const imageClassName = classnames(
    'deck__image',
    handFull && !noCards && 'deck__image--disabled',
  );

  const accessibleButtonText = useMemo(() => {
    if (isFetching) {
      return 'Loading...';
    }
    if (handFull && !noCards) {
      return 'Your hand is full.';
    }
    if (noCards) {
      return 'Your deck is empty.';
    }
    return 'Click to draw a card from your opportunity deck.';
  }, [
    handFull,
    isFetching,
    noCards,
  ]);

  return (
    <div className="deck-container">
      <button
        className={deckClassName}
        onClick={onClick}
        type="button"
      >
        <img
          alt="Opportunity deck"
          className={imageClassName}
          src={imageSrc}
        />
        <span className="u-visually-hidden">
          {accessibleButtonText}
        </span>
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

Deck.displayName = 'Deck';

const mapStateToProps = ({
  cards,
  fate: { data: fateData },
}: IAppState) => ({
  ...cards,
  fateData,
});

type Props = ReturnType<typeof mapStateToProps> & DeckRefreshContextValue;

export default connect(mapStateToProps)(Deck);
