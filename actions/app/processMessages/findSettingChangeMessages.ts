import { SETTING_CHANGE_MESSAGE } from "constants/message-types";
import { ApiResultMessageQualityEffect } from "types/app/messages";

export default function findSettingChangeMessages(
  messages: ApiResultMessageQualityEffect[],
  ignoredMessageTypes: string[] = []
) {
  return messages
    .filter(({ type }) => !ignoredMessageTypes.includes(type))
    .filter(({ type }) => type === SETTING_CHANGE_MESSAGE);
}
