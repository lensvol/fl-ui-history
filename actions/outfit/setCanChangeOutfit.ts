import { SET_CAN_CHANGE_OUTFIT } from "actiontypes/myself";

export type SetCanChangeOutfit = {
  type: typeof SET_CAN_CHANGE_OUTFIT;
  payload: boolean;
};

export default function setCanChangeOutfit(
  canChangeOutfit: boolean
): SetCanChangeOutfit {
  return {
    type: SET_CAN_CHANGE_OUTFIT,
    payload: canChangeOutfit,
  };
}
