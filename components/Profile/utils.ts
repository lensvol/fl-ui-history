import { OUTFIT_CATEGORIES } from "constants/outfits";
import { OutfitSlotName } from "types/outfit";
import { IQuality } from "types/qualities";

export function sortInPossessionsTabOrder(items: IQuality[]) {
  return [...items].sort((a, b) => {
    const aOrder = OUTFIT_CATEGORIES.indexOf(a.category as OutfitSlotName);
    const bOrder = OUTFIT_CATEGORIES.indexOf(b.category as OutfitSlotName);
    return aOrder - bOrder;
  });
}

export function withSortedPossessions(
  group: { name: string; possessions: IQuality[] } | undefined
) {
  if (group === undefined) {
    return undefined;
  }

  return {
    ...group,
    possessions: sortInPossessionsTabOrder(group.possessions),
  };
}
