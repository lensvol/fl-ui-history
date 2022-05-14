import { createSelector } from 'reselect';
import Config from 'configuration';
import { IAppState } from 'types/app';
import { IMyselfState } from 'types/myself';
import { IQuality } from 'types/qualities';

const { sidebarQualityCategories } = Config;

const getMyself = ({ myself }: IAppState) => myself;

const outputFunc = (myself: IMyselfState) => {
  const { qualities } = myself;
  return [...qualities]
    .filter(q => sidebarQualityCategories.indexOf(q.category) >= 0)
    .filter(q => q.category !== 'Skills' || !!q.cap)
    .sort(compareByCategoryOrdering);
};

function compareByCategoryOrdering(a: IQuality, b: IQuality) {
  let aCategoryOrdering = sidebarQualityCategories.indexOf(a.category);
  let bCategoryOrdering = sidebarQualityCategories.indexOf(b.category);

  // If we don't know about this quality's category (but we're somehow comparing it)
  // then it should go after any categories we _do_ know about
  if (aCategoryOrdering < 0) {
    aCategoryOrdering = Number.MAX_VALUE;
  }
  if (bCategoryOrdering < 0) {
    bCategoryOrdering = Number.MAX_VALUE;
  }

  // Compare by category, breaking ties by ID
  if (aCategoryOrdering === bCategoryOrdering) {
    return a.id - b.id;
  }
  return aCategoryOrdering - bCategoryOrdering;
}

export default createSelector([getMyself], outputFunc);
