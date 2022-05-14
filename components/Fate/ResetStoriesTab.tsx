import React, {
  useMemo,
} from 'react';
import AvailableStoryList from 'components/Fate/AvailableStoryList';
import { connect } from 'react-redux';
import {
  PURCHASE_CONTENT,
  RESET_STORY,
} from 'constants/fate';
import getSortedVisibleFateCards from 'selectors/fate/getSortedVisibleFateCards';
import { IAppState } from 'types/app';
import { IFateCard } from 'types/fate';

export function ResetStoriesTab({
  active,
  fateCards,
  onClick,
}: Props) {
  const resetStoryCards = useMemo(
    () => fateCards.filter(c => c.action === PURCHASE_CONTENT && c.type === RESET_STORY),
    [fateCards],
  );

  return (
    <div
      role="tabpanel"
      hidden={!active}
    >
      <h2 className="heading heading--2">
        Reset Stories
      </h2>
      <p>
        Use Fate to reset previously completed premium stories. Relive old tales; make new choices!
      </p>

      <AvailableStoryList
        cards={resetStoryCards}
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

export default connect(mapStateToProps)(ResetStoriesTab);