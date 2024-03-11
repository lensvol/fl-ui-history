import createCachedSelector from "re-reselect";
import { IOutfitState } from "reducers/outfit";
import { IAppState } from "types/app";
import { OutfitSlotName } from "types/outfit";
import { IQuality } from "types/qualities";

const getSlotName = (
  _state: IAppState,
  { name: slotName }: { name: OutfitSlotName }
) => slotName;
const getOutfit = ({ outfit }: IAppState) => outfit;
const getQualities = ({ myself: { qualities } }: IAppState) => qualities;

const cacheKey = getSlotName;

// Look for the quality that matches what we've got stored in the current outfit
const output = (
  outfit: IOutfitState,
  qualities: IQuality[],
  slotName: OutfitSlotName
) => qualities.find((q) => q.id === outfit.slots[slotName]?.id);

export default createCachedSelector(
  [getOutfit, getQualities, getSlotName],
  output
)(cacheKey);
