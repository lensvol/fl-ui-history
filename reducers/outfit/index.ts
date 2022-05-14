import { OutfitActions } from 'actions/outfit';
import * as MyselfActionTypes from 'actiontypes/myself';
import { OutfitSlotName } from 'types/outfit';

import fetchOutfitSuccess from './fetchOutfitSuccess';

export type IOutfitState = {[key in OutfitSlotName]?: number | undefined} & {
  dirty: boolean,
  isChanging: boolean,
  maxOutfits: number,
}

export const INITIAL_STATE: IOutfitState = {
  dirty: false,
  isChanging: false,
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