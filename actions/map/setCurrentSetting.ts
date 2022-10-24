import { SET_CURRENT_SETTING } from "actiontypes/map";
import { ISetting } from "types/map";

export type SetCurrentSetting = {
  type: typeof SET_CURRENT_SETTING;
  payload: ISetting;
};

export default function setCurrentSetting(
  setting: ISetting
): SetCurrentSetting {
  return {
    type: SET_CURRENT_SETTING,
    payload: setting,
  };
}
