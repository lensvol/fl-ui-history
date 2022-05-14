import { EXCLUDED_QUALITY_IDS } from 'constants/possessions';
import { createSelector } from 'reselect';
import { IAppState } from 'types/app';
import { ICategory } from 'types/possessions';
import { IQuality } from 'types/qualities';
import { normalize } from 'utils/stringFunctions';

interface Props {
  categories: ICategory[],
  filterString: string,
}

const getCategories = (_state: IAppState, { categories }: Props) => categories;
const getFilterString = (_state: IAppState, { filterString }: Props) => filterString;
const getQualities = ({ myself: { qualities } }: IAppState) => qualities;

const isExcluded = (id: number) => EXCLUDED_QUALITY_IDS.indexOf(id) >= 0;

const output = (
  categories: ReturnType<typeof getCategories>,
  filterString: ReturnType<typeof getFilterString>,
  qualities: ReturnType<typeof getQualities>,
) => categories
  .map((c, i) => ({ ...c, id: i }))
  .filter(hasMatchingQualities({ filterString, qualities }));

export default createSelector(getCategories, getFilterString, getQualities, output);

export function hasMatchingQualities({
  filterString,
  qualities,
}: {
  filterString: ReturnType<typeof getFilterString>,
  qualities: ReturnType<typeof getQualities>,
}) {
  return (category: ICategory) => {
    const matchingQualities = category.qualities
      .filter(id => !isExcluded(id))
      .map(id => qualities.find(_ => _.id === id));
    return matchingQualities.some(matchesFilterString({ filterString }));
  };
}

export function matchesFilterString({ filterString }: { filterString: string }): (q: IQuality | undefined) => boolean {
  return (q: IQuality | undefined) => q !== undefined && normalize(q.name).indexOf(normalize(filterString)) >= 0;
}