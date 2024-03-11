import { OutfitActions } from "actions/outfit";

import * as MyselfActionTypes from "actiontypes/myself";

import fetchOutfitSuccess from "reducers/outfit/fetchOutfitSuccess";

import { OutfitSlotName } from "types/outfit";

type IOutfitSlots = {
  [key in OutfitSlotName]?: {
    id: number | undefined;
    canChange: boolean;
    isEffect: boolean;
    isOutfit: boolean;
  };
};

export type IOutfitState = {
  slots: IOutfitSlots;
} & {
  dirty: boolean;
  isChanging: boolean;
  isFavourite: boolean;
  maxOutfits: number;
};

export const INITIAL_STATE: IOutfitState = {
  slots: {},
  dirty: false,
  isChanging: false,
  isFavourite: false,
  maxOutfits: 0,
};

export default function reducer(state = INITIAL_STATE, action: OutfitActions) {
  switch (action.type) {
    case MyselfActionTypes.CHANGE_OUTFIT_REQUESTED:
    case MyselfActionTypes.EQUIP_QUALITY_REQUESTED:
      return { ...state, isChanging: true };

    case MyselfActionTypes.EQUIP_QUALITY_SUCCESS:
      return fetchOutfitSuccess(state, action);

    case MyselfActionTypes.CHANGE_OUTFIT_SUCCESS:
      return fetchOutfitSuccess(state, action);

    case MyselfActionTypes.FETCH_OUTFIT_SUCCESS:
      return fetchOutfitSuccess(state, action);

    default:
      return state;
  }
}
