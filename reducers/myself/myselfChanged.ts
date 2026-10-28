import { SetAvatarImageSuccess } from "actions/myself/setAvatarImage";
import { UpdateMyself } from "actions/myself/updateMyself";

import { IMyselfState } from "types/myself";

type MyselfChangedAction = SetAvatarImageSuccess | UpdateMyself;

export default function myselfChanged(
  state: IMyselfState,
  action: MyselfChangedAction
): IMyselfState {
  const { categories, qualities } = state;

  const { payload } = action;

  const newCategories = categories.map((c) => ({
    ...c,
  }));

  const newQualities = qualities.map((q) => ({
    ...q,
  }));

  payload.forEach(({ changeType, possession: updatedQuality }) => {
    // Find the quality with this updated quality's ID
    const idx = newQualities.findIndex((_) => _.id === updatedQuality.id);

    // If this is a quality we don't already have, then add it to the qualities array
    if (idx < 0) {
      newQualities.push({
        ...updatedQuality,
        changeType: undefined,
        previousProgress: undefined,
      });
    } else {
      // Otherwise, merge the existing quality with this value
      const newQuality = newQualities[idx];

      newQualities[idx] = {
        ...newQuality,
        ...updatedQuality,
        changeType,
        isOutfit:
          updatedQuality.isOutfit === undefined
            ? newQuality.isOutfit
            : updatedQuality.isOutfit,
        previousProgress:
          changeType === undefined
            ? undefined
            : {
                level: newQuality.level,
                percentage: newQuality.progressAsPercentage,
              },
      };
    }

    // Look for the category for this quality by its (internal, not human-friendly) name
    const category = newCategories.find((c) =>
      c.categories.includes(updatedQuality.category)
    );

    if (!category) {
      // TODO: why is this? It looks to be an issue with SidebarAbility
      return;
    }

    // Try to find the quality in the list of qualities we know belong to this category;
    // if we don't find one, it's a new quality, so add it
    if (category.qualities.findIndex((id) => id === updatedQuality.id) < 0) {
      category.qualities.push(updatedQuality.id);
    }
  });

  return {
    ...state,
    categories: newCategories,
    qualities: newQualities,
  };
}
