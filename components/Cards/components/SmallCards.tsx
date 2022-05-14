import React, {
  useEffect,
} from 'react';
import { fetch as fetchCards } from 'actions/cards';
import {
  connect,
  useDispatch,
} from 'react-redux';
import { IAppState } from 'types/app';
import DeckRefreshContext from 'components/DeckRefreshContext';
import SmallCardContainer from './SmallCardContainer';
import SmallCountAndTimer from './SmallCountAndTimer';
import SmallDeck from './SmallDeck';


function SmallCards(props: Props) {
  const {
    displayCards,
    handSize,
    wasInvalidatedByEquipmentChange,
  } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    if (wasInvalidatedByEquipmentChange) {
      dispatch(fetchCards());
    }
  }, [dispatch, wasInvalidatedByEquipmentChange]);

  return (
    <>
      <div className="opportunity-cards--small">
        <div className="opportunity-cards__left--small">
          <DeckRefreshContext.Consumer>
            {value => (
              <SmallDeck {...value} />
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
        Pick a card from your hand (
        {displayCards.length}
        /
        {handSize}
        )
      </h2>
      <div className="hand hand--small-media">
        {displayCards.map(card => (
          <SmallCardContainer
            key={card.eventId}
            data={card}
          />
        ))}
      </div>
    </>
  );
}

SmallCards.displayName = 'SmallCards';

const mapStateToProps = ({
  cards: {
    displayCards,
    handSize,
    wasInvalidatedByEquipmentChange,
  },
}: IAppState) => ({
  displayCards,
  handSize,
  wasInvalidatedByEquipmentChange,
});

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(SmallCards);