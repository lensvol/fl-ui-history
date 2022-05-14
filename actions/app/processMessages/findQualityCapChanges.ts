import {
  QUALITY_EXPLICITLY_SET_MESSAGE,
  STANDARD_QUALITY_CHANGE_MESSAGE,
} from 'constants/message-types';
import { ApiResultMessageQualityEffect } from 'types/app/messages';

const MATCHING_MESSAGE_TYPES = [
  QUALITY_EXPLICITLY_SET_MESSAGE,
  STANDARD_QUALITY_CHANGE_MESSAGE,
];

export default function findQualityCapChanges(
  defaultMessages: ApiResultMessageQualityEffect[],
): ApiResultMessageQualityEffect[] {
  return defaultMessages
    .filter(m => MATCHING_MESSAGE_TYPES.indexOf(m.type) >= 0)
    .filter(m => m.possession?.category === 'LevelCap');
}