import { CHANGEABLE_CATEGORIES, EFFECT_CATEGORIES } from "constants/outfits";
import { useMemo } from "react";
import { OutfitSlotName } from "types/outfit";

export const useIsChangeable = (slotName: OutfitSlotName) =>
  useMemo(() => {
    return CHANGEABLE_CATEGORIES.indexOf(slotName) >= 0;
  }, [slotName]);

export const useSelectedOutfit = (outfits: any[]) =>
  useMemo(() => outfits.find((o) => o.selected), [outfits]);

export const useIsEffect = (slotName: OutfitSlotName) =>
  useMemo(() => {
    return EFFECT_CATEGORIES.indexOf(slotName) >= 0;
  }, [slotName]);
