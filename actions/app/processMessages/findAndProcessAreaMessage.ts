import { setCurrentArea } from "actions/map";
import { setTab } from "actions/subtabs";
import { AREA_CHANGE_MESSAGE } from "constants/message-types";
import { ThunkDispatch } from "redux-thunk";
import { AreaChangeMessage, IMessagesObject } from "types/app/messages";
import { StoryletActiveTab } from "types/subtabs";

export default function findAndProcessAreaMessage({
  areaMessage,
  defaultMessages,
}: IMessagesObject) {
  return (dispatch: ThunkDispatch<any, any, any>) => {
    // Older versions of the API return messages.areaMessage
    if (areaMessage) {
      dispatch(processAreaChangeMessage(areaMessage));
      return;
    }

    // Newer versions return an AreaChangeMessage in messages.defaultMessages
    const areaMessageInDefaultMessages = defaultMessages?.find(
      (message) => message.type === AREA_CHANGE_MESSAGE
    );
    if (areaMessageInDefaultMessages) {
      dispatch(
        processAreaChangeMessage(
          areaMessageInDefaultMessages as AreaChangeMessage
        )
      );
    }
  };
}

export function processAreaChangeMessage(message: AreaChangeMessage) {
  return (dispatch: ThunkDispatch<any, any, any>) => {
    const { area } = message;
    // Update the player's current area
    dispatch(setCurrentArea(area));
    // If we're moving to an area with no opp deck, ensure that we put the player on the Always subtab
    if (!area.showOps) {
      const subtab: StoryletActiveTab = "always";
      dispatch(setTab({ tab: "storylet", subtab }));
    }
  };
}
