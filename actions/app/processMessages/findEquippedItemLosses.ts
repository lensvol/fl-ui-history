import { IAppState } from 'types/app';
import { ApiResultMessageQualityEffect } from 'types/app/messages';
import { OutfitSlotName } from 'types/outfit';

export default function findEquippedItemLosses(
  messages: ApiResultMessageQualityEffect[],
  state: IAppState,
  ignoredMessageTypes: string[] = [],
) {
  return messages
    .filter(({ type }) => ignoredMessageTypes.indexOf(type) < 0)
    .filter(isEquippableItemLoss);

  function isEquippableItemLoss(message: ApiResultMessageQualityEffect) {
    const { possession } = message;

    const id = possession?.id;
    const level = possession?.level;

    // If we have 1 or more of this quality, then we obviously haven't lost an equippable quality
    if ((level ?? Number.MAX_SAFE_INTEGER) > 0) {
      return false;
    }

    const { outfit } = state;

    // Check whether any slot currently has this item in it; if so, then
    // we have lost an equipped item
    return Object.keys(outfit).some(k => outfit[k as OutfitSlotName] === id);
  }
}