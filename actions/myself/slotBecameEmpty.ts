import { SLOT_BECAME_EMPTY } from "actiontypes/myself";
import { ActionCreator } from "redux";
import { IQuality } from "types/qualities";

export type SlotBecameEmpty = {
  type: typeof SLOT_BECAME_EMPTY;
  payload: IQuality;
};

export const slotBecameEmpty: ActionCreator<SlotBecameEmpty> = (
  possession: IQuality
) => ({
  type: SLOT_BECAME_EMPTY,
  payload: possession,
});

export default slotBecameEmpty;
