import { OUTFIT_CATEGORIES } from "constants/outfits";
import { IAppState } from "types/app";
import { ApiResultMessageQualityEffect } from "types/app/messages";

export default function findNewEquippableItems(
  messages: ApiResultMessageQualityEffect[],
  state: IAppState
) {
  return messages.filter((m) => isNewEquippableItemMesage(m, state));
}

function isNewEquippableItemMesage(
  message: ApiResultMessageQualityEffect,
  state: IAppState
): boolean {
  const { possession } = message;

  if (!possession) {
    return false;
  }

  const { category, nature, id } = possession;

  // We need all of these properties
  if (!(category && nature && id)) {
    return false;
  }

  // Only check Things
  if (nature !== "Thing") {
    return false;
  }

  // If it's not an outfit quality, return false
  if ((OUTFIT_CATEGORIES as string[]).indexOf(category.replace(/ /g, "")) < 0) {
    return false;
  }

  // Return false if we already have a quality matching this description; otherwise true
  return !state.myself.qualities.find((q) => q.id === id);
}
