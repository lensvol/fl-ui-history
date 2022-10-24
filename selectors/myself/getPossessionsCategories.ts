import { ICategoriesState } from "reducers/categories";
import { createSelector } from "reselect";
import { OUTFIT_CATEGORIES } from "constants/outfits";
import { EXCLUDED_CATEGORY_NAMES } from "constants/possessions";
import { IAppState } from "types/app";
import { ICategory } from "types/possessions";

function getAllCategories(state: IAppState) {
  return state.categories;
}

function getMyselfCategories({ myself: { categories } }: IAppState) {
  return categories;
}

export function hasThingNaturedQualities(
  category: ICategory,
  allCategories: ICategoriesState
) {
  // We need to remove spaces to normalize name -> enum
  return allCategories.Thing.indexOf(category.name.replace(/ /g, "")) >= 0;
}

export function isNotAnEquippableCategory(category: ICategory): boolean {
  return (
    (OUTFIT_CATEGORIES as string[]).indexOf(category.name.replace(/ /g, "")) < 0
  );
}

function outputFn(
  allCategories: ReturnType<typeof getAllCategories>,
  myselfCategories: ReturnType<typeof getMyselfCategories>
) {
  return [...myselfCategories]
    .map((c, i) => ({ ...c, id: i }))
    .filter((c) => c.qualities.length)
    .filter(isNotExcluded)
    .filter(isNotAnEquippableCategory)
    .filter((c) => hasThingNaturedQualities(c, allCategories))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function isNotExcluded(category: { name: string }): boolean {
  return !EXCLUDED_CATEGORY_NAMES.includes(category.name);
}

export default createSelector(
  [getAllCategories, getMyselfCategories],
  outputFn
);
