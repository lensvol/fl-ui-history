import { EquipQualitySuccess } from "actions/outfit/changeEquipped";
import { ChangeOutfitSuccessAction } from "actions/outfit/changeOutfit";
import { FetchOutfitSuccessAction } from "actions/outfit/fetchOutfit";

import { IOutfitState } from "reducers/outfit/index";

export default function fetchOutfitSuccess(
  state: IOutfitState,
  action:
    | ChangeOutfitSuccessAction
    | EquipQualitySuccess
    | FetchOutfitSuccessAction
): IOutfitState {
  const { payload } = action;

  return {
    ...state,
    slots: {
      ...state.slots,
      ...payload.slots.reduce(reduceFn, {}),
    },
    dirty: payload.dirty,
    maxOutfits: payload.maxOutfits,
    isChanging: false,
    isFavourite: payload.isFavourite,
  };
}

function reduceFn(
  acc: {
    [key: string]: {
      id: number | undefined;
      canChange: boolean;
      isEffect: boolean;
      isOutfit: boolean;
    };
  },
  next: {
    name: string;
    qualityId?: number | undefined;
    canChange: boolean;
    isEffect: boolean;
    isOutfit: boolean;
  }
) {
  const { name, qualityId, canChange, isEffect, isOutfit } = next;

  return {
    ...acc,
    [name.replace(/ /g, "")]: {
      id: qualityId,
      canChange,
      isEffect,
      isOutfit,
    },
  };
}
