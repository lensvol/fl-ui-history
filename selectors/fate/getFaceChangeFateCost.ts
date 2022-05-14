import { createSelector } from 'reselect';
import { IAppState } from 'types/app';
import { IFateCard } from 'types/fate';

const getFateCards = (state: Pick<IAppState, 'fate'>) => state.fate.data.fateCards;

const outputFn = (fateCards: IFateCard[]) => {
  const card = fateCards.find(c => c.action === 'FaceChange');
  if (card) {
    return card.price;
  }
  return 0;
};

export default createSelector(getFateCards, outputFn);