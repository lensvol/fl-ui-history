import {
  PURCHASE_CONTENT,
  PURCHASE_STORY,
} from 'constants/fate';
import React, {
  useMemo,
} from 'react';
import { connect } from 'react-redux';
import getSortedVisibleFateCards from 'selectors/fate/getSortedVisibleFateCards';
import { IAppState } from 'types/app';
import { IFateCard } from 'types/fate';
import AvailableStoryList from './AvailableStoryList';

export function PurchaseStoriesTab({
  active,
  fateCards,
  onClick,
}: Props) {
  const purchaseStoryFateCards = useMemo(
    () => fateCards.filter(c => c.action === PURCHASE_CONTENT && c.type === PURCHASE_STORY),
    [fateCards],
  );

  return (
    <div
      role="tabpanel"
      hidden={!active}
    >
      <h2 className="heading heading--2">
        Purchase Stories
      </h2>
      <p>
        Unlock premium stories — delicious chunks of narrative, delving into the deep lore of Fallen London.
      </p>

      <AvailableStoryList
        cards={purchaseStoryFateCards}
        onClick={onClick}
      />
    </div>
  );
}

type OwnProps = {
  active: boolean,
  onClick: (card: IFateCard) => void,
};

const mapStateToProps = (state: IAppState) => ({
  fateCards: getSortedVisibleFateCards(state),
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(PurchaseStoriesTab);
