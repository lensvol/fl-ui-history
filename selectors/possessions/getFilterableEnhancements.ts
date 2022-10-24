/* eslint-disable no-continue */
import {
  EXPLICITLY_FILTERABLE_QUALITY_IDS,
  FILTERABLE_CATEGORY_NAMES,
  UNFILTERABLE_ENHANCEMENT_QUALITY_IDS,
} from "constants/possessions";
import { createSelector } from "reselect";
import { IAppState } from "types/app";
import { IEnhancement, IQuality } from "types/qualities";

const getQualities = (state: IAppState) => state.myself.qualities;

/*
const categoryOrdering: { [key: string]: number } = {
  BasicAbility: 0,
  SidebarAbility: 1,
  Menace: 2,
  Skills: 3,
};
 */

// We want to sort qualities with grab-bag miscellanea to the end of the list
function getSortingIndexForCategory(category: string) {
  const index = FILTERABLE_CATEGORY_NAMES.indexOf(category);
  if (index >= 0) {
    return index;
  }

  return Number.MAX_SAFE_INTEGER;
}

const outputFn = (qualities: IQuality[]) => {
  const enhancementKeyValuePairs: IEnhancement[] = [];
  const { length } = qualities;

  // Build a list of { category, qualityId } objects containing
  // the enhancement quality IDs that we're going to offer in the filter dropdown
  for (let i = 0; i < length; i++) {
    const quality = qualities[i];
    const { enhancements } = quality;

    if (!enhancements) {
      continue;
    }

    if ((enhancements.length ?? 0) <= 0) {
      continue;
    }

    for (let j = 0; j < enhancements.length; j++) {
      const { category, qualityId } = enhancements[j];

      // Only allow members of the categories we want, or qualities from other categories
      // that we're explicitly allowing
      if (
        FILTERABLE_CATEGORY_NAMES.indexOf(category) < 0 &&
        EXPLICITLY_FILTERABLE_QUALITY_IDS.indexOf(qualityId) < 0
      ) {
        continue;
      }

      // Exclude qualities that are on the block list
      if (UNFILTERABLE_ENHANCEMENT_QUALITY_IDS.indexOf(qualityId) >= 0) {
        continue;
      }

      // Don't add duplicates
      if (
        enhancementKeyValuePairs.find((item) => item.qualityId === qualityId)
      ) {
        continue;
      }

      enhancementKeyValuePairs.push(enhancements[j]);
    }
  }

  return [...enhancementKeyValuePairs].sort((a, b) => {
    if (a.category === b.category) {
      return a.qualityId - b.qualityId;
    }
    return (
      getSortingIndexForCategory(a.category) -
      getSortingIndexForCategory(b.category)
    );
  });
};

export default createSelector([getQualities], outputFn);
