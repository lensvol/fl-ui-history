import { slotBecameEmpty } from "actions/myself";
import { Dispatch } from "redux";
import { ApiResultMessageQualityEffect } from "types/app/messages";

export default function processEquippedItemLosses(
  messages: ApiResultMessageQualityEffect[]
) {
  return (dispatch: Dispatch) => {
    messages.forEach(({ possession }) => {
      if (possession) {
        dispatch(slotBecameEmpty(possession));
      }
    });
  };
}
