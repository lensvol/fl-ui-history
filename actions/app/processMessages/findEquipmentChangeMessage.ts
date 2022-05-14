import { ApiResultMessageQualityEffect } from 'types/app/messages';

export default function findEquipmentChangeMessage(messages: ApiResultMessageQualityEffect[]) {
  return messages.find(message => message.type === 'EquipmentChangeMessage');
}