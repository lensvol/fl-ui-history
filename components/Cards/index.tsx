import React, { useEffect } from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';
import { fetch as fetchCards } from 'actions/cards';
import { IAppState } from 'types/app';

import DeckRefreshContext from 'components/DeckRefreshContext';
import Deck from './components/Deck';
import Hand from './components/Hand';

const mapStateToProps = ({
  cards: { wasInvalidatedByEquipmentChange },
  map: { showOps },
}: IAppState) => ({
  showOps,
  wasInvalidatedByEquipmentChange,
});

function Cards(props: ReturnType<typeof mapStateToProps>) {
  const {
    showOps,
    wasInvalidatedByEquipmentChange,
  } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    if (wasInvalidatedByEquipmentChange) {
      dispatch(fetchCards());
    }
  }, [dispatch, wasInvalidatedByEquipmentChange]);

  if (!showOps) {
    return null;
  }

  return (
    <div className="cards">
      <DeckRefreshContext.Consumer>
        {value => <Deck {...value} />}
      </DeckRefreshContext.Consumer>
      <Hand />
    </div>
  );
}

Cards.displayName = 'Cards';

export default connect(mapStateToProps)(Cards);
