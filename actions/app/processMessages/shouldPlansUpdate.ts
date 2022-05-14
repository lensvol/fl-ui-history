import {
  PLAN_COMPLETED_MESSAGE,
} from 'constants/message-types';
import {
  ApiResultMessageQualityEffect,
} from 'types/app/messages';


export default function shouldPlansUpdate(
  defaultMessages: ApiResultMessageQualityEffect[],
  planQualityRequirementIds: number[],
) {
  const qualityRelevantToCurrentPlansHasChanged
    = defaultMessages.some(({ possession }) => possession?.id && planQualityRequirementIds.includes(possession.id));

  const planHasBeenCompleted = defaultMessages.some(({ type }) => type === PLAN_COMPLETED_MESSAGE);

  return qualityRelevantToCurrentPlansHasChanged || planHasBeenCompleted;
}