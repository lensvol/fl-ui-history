import { ICategoriesState } from 'reducers/categories';
import { createSelector } from 'reselect';
import { hasThingNaturedQualities } from 'selectors/myself/getPossessionsCategories';
import { IAppState } from 'types/app';
import { ICategory } from 'types/possessions';

const getAllCategories = ({ categories }: IAppState) => categories;

const getMyselfCategories = ({ myself: { categories } }: IAppState) => categories;

function outputFn(
  allCategories: ReturnType<typeof getAllCategories>,
  myselfCategories: ReturnType<typeof getMyselfCategories>,
) {
  return [...myselfCategories]
    .map((c, i) => ({ ...c, id: i })) // Add an 'id' field
    .filter(c => !hasThingNaturedQualities(c, allCategories)) // Trivially exclude
    .filter(c => hasStatusNaturedQualities(c, allCategories)) // Exclude non-Status categories
    .filter(c => !isEmpty(c)) // Exclude empty categories
    .sort(sortByName); // Finally, sort by name
}

export default createSelector([getAllCategories, getMyselfCategories], outputFn);

export function hasStatusNaturedQualities(category: ICategory, allCategories: ICategoriesState) {
  return category.categories.some(c => allCategories.Status.indexOf(c) >= 0);
}

function isEmpty(category: ICategory): boolean {
  return category.qualities.length === 0;
}

export function sortByName(a: { name: string }, b: { name: string }) {
  const aName = a.name;
  const bName = b.name;
  return aName.localeCompare(bName);
}