import { createSelector } from "reselect";
import { EXCLUDED_CATEGORY_NAMES } from "constants/possessions";
import { IOutfitState } from "reducers/outfit";
import { IAppState } from "types/app";
import { OutfitSlotName } from "types/outfit";
import { ICategory } from "types/possessions";
import { IQuality } from "types/qualities";

function getMyselfCategories({ myself: { categories } }: IAppState) {
  return categories;
}

const getMyselfQualities = (state: IAppState) => state.myself.qualities;

function getOutfit(state: IAppState) {
  return state.outfit;
}

export function hasThingNaturedQualities(
  category: ICategory,
  myselfQualities: IQuality[]
) {
  // We need to remove spaces to normalize name -> enum
  const categoryName = category.name.replace(/ /g, "");

  return myselfQualities.some(
    (q) => q.nature === "Thing" && q.category === categoryName
  );
}

export function isNotAnEquippableCategory(
  category: ICategory,
  outfit: IOutfitState
): boolean {
  return !outfit.slots[category.name.replace(/ /g, "") as OutfitSlotName]
    ?.isOutfit;
}

function outputFn(
  myselfCategories: ReturnType<typeof getMyselfCategories>,
  myselfQualities: ReturnType<typeof getMyselfQualities>,
  outfit: ReturnType<typeof getOutfit>
) {
  return [...myselfCategories]
    .map((c, i) => ({ ...c, id: i }))
    .filter((c) => c.qualities.length)
    .filter(isNotExcluded)
    .filter((c) => isNotAnEquippableCategory(c, outfit))
    .filter((c) => hasThingNaturedQualities(c, myselfQualities))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function isNotExcluded(category: { name: string }): boolean {
  return !EXCLUDED_CATEGORY_NAMES.includes(category.name);
}

export default createSelector(
  [getMyselfCategories, getMyselfQualities, getOutfit],
  outputFn
);
