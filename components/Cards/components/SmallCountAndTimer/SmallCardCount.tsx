import React, {
  Fragment,
  useMemo,
} from 'react'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { IAppState } from 'types/app';
import CardTimer from '../CardTimer';

export function SmallCardCount({
  cardsCount,
  displayCards,
  deckSize,
  handSize,
}: Props) {
  const isHandFull = displayCards.length === handSize;

  const handFullFragment = useMemo(() => (
    <p>
      Your hand is full; you must play or discard a card before you can draw another.
    </p>
  ), []);

  if (cardsCount > deckSize) {
    return (
      <>
        No draw limit.
        {' '}
        {isHandFull && handFullFragment}
      </>
    );
  }

  if (cardsCount === 0) {
    return (
      <Fragment>
        <p>
          No cards waiting.
          {' '}
          <CardTimer formatter={str => `(${str}.)`} />
        </p>
      </Fragment>
    );
  }
  if (cardsCount === 1) {
    return (
      <Fragment>
        <p>
          There is 1 card in your Opportunity Deck.
          {' '}
          <CardTimer formatter={str => `(${str}.)`} />
        </p>
      </Fragment>
    );
  }
  return (
    <>
      <p>
        {`There are ${cardsCount} cards in your Opportunity Deck.`}
        {' '}
        <CardTimer formatter={str => `(${str}.)`} />
      </p>
      {' '}
      {isHandFull && handFullFragment}
    </>
  );
}

SmallCardCount.displayName = 'SmallCardCount';

const mapStateToProps = ({
  cards: {
    cardsCount,
    displayCards,
    deckSize,
    handSize,
  },
}: IAppState) => ({
  cardsCount,
  deckSize,
  displayCards,
  handSize,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(SmallCardCount);