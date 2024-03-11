import { QUALITY_ID_DUMMY_SHOW_ALL_ITEMS } from "components/Equipment/constants";
import createCachedSelector from "re-reselect";
import { IOutfitState } from "reducers/outfit";
import { OutfitSlotName } from "types/outfit";
import { IQuality } from "types/qualities";
import { IAppState } from "types/app";

type Props = {
  name: OutfitSlotName;
};

export const compareIds = (a: IQuality, b: IQuality) => Math.sign(a.id - b.id);

export const makeQualityFilterForSlotName = (name: string) => {
  return (q: IQuality) => q.category === name && excludeZeroLevelQualities(q);
};

const excludeZeroLevelQualities = (q: IQuality) => {
  return q.level > 0;
};

function makeExcludeEquippedItems(
  outfit: IOutfitState,
  slotName: OutfitSlotName
) {
  // can't call useIsEffect here, because it's a hook, and this is not a component
  return (q: IQuality) => {
    return (
      (outfit.slots[q.category as OutfitSlotName]?.isEffect ?? false) ||
      outfit.slots[slotName]?.id !== q.id ||
      q.level > 1
    );
  };
}

const getName = (_state: IAppState, { name }: Props) => name;

const getOutfitState = ({ outfit }: IAppState) => outfit;

const getQualities = ({ myself: { qualities } }: IAppState) => qualities;

const getSelectedEnhancementQualityID = (state: IAppState) =>
  state.equipment.selectedEnhancementQualityId;

const cacheKey = getName;

function makeEnhancementComparator(qualityId: number) {
  return (a: IQuality, b: IQuality) => {
    const aEnhancement =
      a.enhancements?.find((e) => e.qualityId === qualityId)?.level ??
      Number.MIN_SAFE_INTEGER;
    const bEnhancement =
      b.enhancements?.find((e) => e.qualityId === qualityId)?.level ??
      Number.MIN_SAFE_INTEGER;
    return bEnhancement - aEnhancement;
  };
}

const outputFunc = (
  name: OutfitSlotName,
  outfit: IOutfitState,
  qualities: IQuality[],
  selectedEnhancementQualityId: number
) => {
  const filterBySlotName = makeQualityFilterForSlotName(name);
  const excludeEquippedItems = makeExcludeEquippedItems(outfit, name);

  const enhancementComparator =
    selectedEnhancementQualityId === QUALITY_ID_DUMMY_SHOW_ALL_ITEMS
      ? compareIds
      : makeEnhancementComparator(selectedEnhancementQualityId);

  const enhancementFilter =
    selectedEnhancementQualityId === QUALITY_ID_DUMMY_SHOW_ALL_ITEMS
      ? (_: IQuality) => true
      : (q: IQuality) =>
          q.enhancements?.find(
            (e) => e.qualityId === selectedEnhancementQualityId
          );

  return [...qualities]
    .filter(filterBySlotName)
    .filter(excludeZeroLevelQualities)
    .filter(excludeEquippedItems)
    .filter(enhancementFilter)
    .sort(enhancementComparator);
};

export default createCachedSelector(
  [getName, getOutfitState, getQualities, getSelectedEnhancementQualityID],
  outputFunc
)(cacheKey);
