import { createSelector } from 'reselect';
import getVisibleFateCards from './getVisibleFateCards';

export const outputFn = (cards: ReturnType<typeof getVisibleFateCards>) => [...cards]
  .sort((a, b) => +(new Date(a.releaseDate)) - +(new Date(b.releaseDate)))
  .reverse();

export default createSelector([getVisibleFateCards], outputFn);
