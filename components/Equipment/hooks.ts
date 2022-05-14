import { CHANGEABLE_CATEGORIES } from 'constants/outfits';
import { useMemo } from 'react';
import { OutfitSlotName } from 'types/outfit';

export const useIsChangeable = (slotName: OutfitSlotName) => useMemo(() => {
  return CHANGEABLE_CATEGORIES.indexOf(slotName) >= 0;
}, [slotName]);

export const useSelectedOutfit = (outfits: any[]) => useMemo(() => outfits.find(o => o.selected), [outfits]);
