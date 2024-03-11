import { createSelector } from "reselect";
import { hasThingNaturedQualities } from "selectors/myself/getPossessionsCategories";
import { IAppState } from "types/app";
import { ICategory } from "types/possessions";
import { IQuality } from "types/qualities";

const getMyselfCategories = ({ myself: { categories } }: IAppState) =>
  categories;

const getMyselfQualities = (state: IAppState) => state.myself.qualities;

function outputFn(
  myselfCategories: ReturnType<typeof getMyselfCategories>,
  myselfQualities: ReturnType<typeof getMyselfQualities>
) {
  return [...myselfCategories]
    .map((c, i) => ({ ...c, id: i })) // Add an 'id' field
    .filter((c) => !hasThingNaturedQualities(c, myselfQualities)) // Trivially exclude
    .filter((c) => hasStatusNaturedQualities(c, myselfQualities)) // Exclude non-Status categories
    .filter((c) => !isEmpty(c)) // Exclude empty categories
    .sort(sortByName); // Finally, sort by name
}

export default createSelector(
  [getMyselfCategories, getMyselfQualities],
  outputFn
);

export function hasStatusNaturedQualities(
  category: ICategory,
  myselfQualities: IQuality[]
) {
  return myselfQualities.some(
    (q) =>
      q.nature === "Status" && category.categories.some((c) => q.category === c)
  );
}

function isEmpty(category: ICategory): boolean {
  return category.qualities.length === 0;
}

export function sortByName(a: { name: string }, b: { name: string }) {
  const aName = a.name;
  const bName = b.name;

  return aName.localeCompare(bName);
}
