import findOutfitGrantedMessage from "actions/app/processMessages/findOutfitGrantedMessage";
import {
  ACTIONS_REFRESHED_MESSAGE,
  AREA_CHANGE_MESSAGE,
  DECK_REFRESHED_MESSAGE,
  DIFFICULTY_ROLL_FAILURE_MESSAGE,
  DIFFICULTY_ROLL_SUCCESS_MESSAGE,
  FATE_BRANCH_CURRENCY_USED_MESSAGE,
  FATE_POINT_CHANGE_MESSAGE,
  STORE_ITEM_CURRENCY_USED_MESSAGE,
} from "constants/message-types";
import {
  ActionsRefreshedMessage,
  ApiResultMessageQualityEffect,
  AreaChangeMessage,
  FateMessage,
  IMessages,
  IMessagesObject,
  DeckRefreshedMessage,
} from "types/app/messages";

export default function buildMessagesObject(
  messages: IMessages
): IMessagesObject {
  if (!Array.isArray(messages)) {
    return {
      ...messages,
      // Live/staging API differ in where area change messages go; this line
      // ensures that we find it if it's in defaultMessages
      areaMessage:
        messages.areaMessage ?? findAreaMessage(messages.defaultMessages),
    };
  }
  return {
    actionMessage: findActionMessage(messages),
    areaMessage: findAreaMessage(messages),
    deckRefreshedMessage: findDeckRefreshedMessage(messages),
    defaultMessages: messages, // Put everything in here
    difficultyMessages: findDifficultyMessages(messages),
    fateMessage: findFateMessage(messages),
    headlineMessages: findHeadlineMessages(messages),
    hiddenMessages: [],
    outfitGrantedMessage: findOutfitGrantedMessage(messages),
    standardMessages: findStandardMessages(messages),
  };
}

export function excludeSpecialMessages(
  messages: ApiResultMessageQualityEffect[]
) {
  return messages.filter((m) => !isSpecialMessage(m));
}

export function findActionMessage(messages: ApiResultMessageQualityEffect[]) {
  const actionMessage = messages.find(isActionsRefreshedMessage);
  if (actionMessage) {
    return actionMessage as ActionsRefreshedMessage;
  }
  return undefined;
}

export function findDifficultyMessages(
  messages: ApiResultMessageQualityEffect[]
) {
  return messages.filter(isDifficultyMessage);
}

export function findAreaMessage(messages: ApiResultMessageQualityEffect[]) {
  const areaMessage = messages.find(isAreaChangeMessage);
  if (areaMessage) {
    return areaMessage as AreaChangeMessage;
  }
  return undefined;
}

export function findDeckRefreshedMessage(
  messages: ApiResultMessageQualityEffect[]
) {
  const deckRefreshedMessage = messages.find(isDeckRefreshedMessage);
  if (deckRefreshedMessage) {
    return deckRefreshedMessage as DeckRefreshedMessage;
  }
  return deckRefreshedMessage;
}

export function findFateMessage(messages: ApiResultMessageQualityEffect[]) {
  const fateMessage = messages.find(isFateMessage);
  if (fateMessage) {
    return fateMessage as FateMessage;
  }
  return undefined;
}

export function findHeadlineMessages(
  messages: ApiResultMessageQualityEffect[]
) {
  return excludeSpecialMessages(messages).filter((m) => m.priority === 1);
}

export function findStandardMessages(
  messages: ApiResultMessageQualityEffect[]
) {
  return excludeSpecialMessages(messages).filter((m) => m.priority === 2);
}

export function isActionsRefreshedMessage(m: ApiResultMessageQualityEffect) {
  return m.type === ACTIONS_REFRESHED_MESSAGE;
}

export function isAreaChangeMessage(m: ApiResultMessageQualityEffect) {
  return m.type === AREA_CHANGE_MESSAGE;
}

export function isDeckRefreshedMessage(m: ApiResultMessageQualityEffect) {
  return m.type === DECK_REFRESHED_MESSAGE;
}

export function isDifficultyMessage(m: ApiResultMessageQualityEffect) {
  return (
    [DIFFICULTY_ROLL_FAILURE_MESSAGE, DIFFICULTY_ROLL_SUCCESS_MESSAGE].indexOf(
      m.type
    ) >= 0
  );
}

export function isFateMessage(m: ApiResultMessageQualityEffect) {
  return (
    [
      FATE_BRANCH_CURRENCY_USED_MESSAGE,
      FATE_POINT_CHANGE_MESSAGE,
      STORE_ITEM_CURRENCY_USED_MESSAGE,
    ].indexOf(m.type) >= 0
  );
}

export function isSpecialMessage(m: ApiResultMessageQualityEffect) {
  return isAreaChangeMessage(m) || isDifficultyMessage(m) || isFateMessage(m);
}
