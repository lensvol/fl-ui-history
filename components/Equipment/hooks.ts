import { useMemo } from "react";

import { IOutfitState } from "reducers/outfit";

import { OutfitSlotName } from "types/outfit";

export const useIsChangeable = (
  slotName: OutfitSlotName,
  outfit: IOutfitState
) =>
  useMemo(() => {
    return outfit.slots[slotName]?.canChange ?? false;
  }, [outfit, slotName]);

export const useSelectedOutfit = (outfits: any[]) =>
  useMemo(() => {
    return outfits.find((o) => o.selected);
  }, [outfits]);

export const useIsEffect = (slotName: OutfitSlotName, outfit: IOutfitState) =>
  useMemo(() => {
    return outfit.slots[slotName]?.isEffect ?? false;
  }, [outfit, slotName]);
