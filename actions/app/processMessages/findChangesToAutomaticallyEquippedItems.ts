import { IAppState } from 'types/app';
import { ApiResultMessageQualityEffect } from 'types/app/messages';
import { AUTO_EQUIPPED_CATEGORIES } from 'constants/autoEquippedCategories';

export default function findChangesToAutomaticallyEquippedItems(
  messages: ApiResultMessageQualityEffect[],
  _state: IAppState,
  ignoredMessageTypes: string[] = [],
) {
  return messages
    .filter(m => ignoredMessageTypes.indexOf(m.type) < 0)
    .filter(m => isAutomaticallyEquippedItem(m));
}

function isAutomaticallyEquippedItem(message: ApiResultMessageQualityEffect) {
  const category = message.possession?.category;
  return category !== undefined && AUTO_EQUIPPED_CATEGORIES.indexOf(category) >= 0;
}