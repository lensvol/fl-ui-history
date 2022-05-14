import {
  AREA_CHANGE_MESSAGE,
  SETTING_CHANGE_MESSAGE,
} from 'constants/message-types';
import {
  ApiResultMessageQualityEffect,
} from 'types/app/messages';
import { IQuality } from 'types/qualities';

// A quality change message with the constraint that the possession not be undefined; used for a type-guard below
type QualityEffectWithPossession = ApiResultMessageQualityEffect & { possession: IQuality };

export default function shouldFetchOpportunityCards(
  defaultMessages: ApiResultMessageQualityEffect[],
  opportunityQualityRequirementIds: number[],
  deckRefreshedMessage: ApiResultMessageQualityEffect | undefined,
) {
  const hasDeckBeenRefreshed = !!deckRefreshedMessage;

  const qualityRelevantToCurrentPlansHasChanged = defaultMessages
    .filter((m): m is QualityEffectWithPossession => !!m.possession)
    .map(m => ({ ...m, possession: m.possession }))
    .some(({ possession: { id } }) => id && opportunityQualityRequirementIds.indexOf(id) >= 0);

  const areaHasChanged = defaultMessages.some(m => m.type === AREA_CHANGE_MESSAGE);
  const settingHasChanged = defaultMessages.some(({ type }) => type === SETTING_CHANGE_MESSAGE);

  return hasDeckBeenRefreshed || qualityRelevantToCurrentPlansHasChanged || settingHasChanged || areaHasChanged;
}