import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { IAppState } from 'types/app';
import CardContainer from './CardContainer';
import Tile from './Tile';

type Props = ReturnType<typeof mapStateToProps>;

export function Hand({ displayCards, handSize, isFetching }: Props) {
  const cards = useMemo(() => {
    const components = [];

    // Add the cards
    displayCards
      .slice(0, handSize)
      .forEach((card) => {
        components.push(<CardContainer key={card.eventId} data={card} />);
      });

    // Add an empty tile for each empty spot in the player's hand
    for (let i = 0; i < Math.max(handSize - displayCards.length, 0); i += 1) {
      components.push(<Tile key={i} isFetching={isFetching} />);
    }

    return components;
  }, [
    displayCards,
    handSize,
    isFetching,
  ]);

  return (
    <div
      className={classnames(
        'hand',
        (displayCards.length === 5) && 'hand--5',
      )}
    >
      {cards}
    </div>
  );
}

Hand.displayName = 'Hand';

function mapStateToProps({ cards: { displayCards, handSize, isFetching } }: IAppState) {
  return {
    displayCards,
    handSize,
    isFetching,
  };
}

export default connect(mapStateToProps)(Hand);