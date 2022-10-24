import isAreaUnlockMessage from "actions/app/processMessages/isAreaUnlockMessage";
import {
  MAP_SHOULD_UPDATE_MESSAGE,
  SETTING_CHANGE_MESSAGE,
} from "constants/message-types";
import { IAppState } from "types/app";
import { ApiResultMessageQualityEffect } from "types/app/messages";

export default function findChangesToMapState(
  messages: ApiResultMessageQualityEffect[],
  state: IAppState,
  ignoredMessageTypes: string[] = []
): ApiResultMessageQualityEffect[] {
  return messages
    .filter((m) => ignoredMessageTypes.indexOf(m.type) < 0)
    .filter((m) => isChangeToMapState(m, state));
}

function isChangeToMapState(
  message: ApiResultMessageQualityEffect,
  _state: IAppState
): boolean {
  const { possession, type } = message;

  // If this message is explicitly telling us that we should update, then we should update
  if (type === MAP_SHOULD_UPDATE_MESSAGE) {
    return true;
  }

  // If we've changed setting, then we need to update
  if (type === SETTING_CHANGE_MESSAGE) {
    return true;
  }

  // Route added/removed --- we need to update
  if (possession?.category === "Route") {
    return true;
  }

  // This is a quality that unlocks an area
  // noinspection RedundantIfStatementJS
  if (isAreaUnlockMessage(message)) {
    return true;
  }

  return false;
}
