import {
  ApiResultMessageQualityEffect,
  IOutfitGrantedMessage,
} from "types/app/messages";
import { OUTFIT_GRANTED_MESSAGE } from "constants/message-types";

export default function findOutfitGrantedMessage(
  messages: ApiResultMessageQualityEffect[]
) {
  const message = messages.find((m) => m.type === OUTFIT_GRANTED_MESSAGE);

  if (message) {
    return message as IOutfitGrantedMessage;
  }

  return message;
}
