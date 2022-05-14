import { createSelector } from 'reselect';
import { IAppState } from 'types/app';
import { IFateCard } from 'types/fate';

const getFateCards = ({ fate: { data: { fateCards } } }: IAppState) => fateCards;

const outputFn = (fateCards: IFateCard[]) => fateCards.find(card => card.action === 'AskNameChange');

export default createSelector(getFateCards, outputFn);
