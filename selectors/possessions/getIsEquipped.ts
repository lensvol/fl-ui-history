import createCachedSelector from "re-reselect";
import { IAppState } from "types/app";
import { OutfitSlotName } from "types/outfit";

interface Props {
  id: number;
}

const getId = (_state: IAppState, { id }: Props) => id;
const getOutfit = ({ outfit }: IAppState) => outfit;

const cacheKey = (_state: IAppState, { id }: Props) => `${id}`;

// Very simply, just check to see whether any of the equipped items
// in the outfit state slice has this ID; if so, it's equipped
const output = (
  id: ReturnType<typeof getId>,
  outfit: ReturnType<typeof getOutfit>
) =>
  Object.keys(outfit.slots).some(
    (k) => outfit.slots[k as OutfitSlotName]?.id === id
  );

export default createCachedSelector(getId, getOutfit, output)(cacheKey);
