import { EquipQualitySuccess } from 'actions/outfit/changeEquipped';
import { ChangeOutfitSuccessAction } from 'actions/outfit/changeOutfit';
import { FetchOutfitSuccessAction } from 'actions/outfit/fetchOutfit';
import { IOutfitState } from 'reducers/outfit/index';

export default function fetchOutfitSuccess(
  state: IOutfitState,
  action: ChangeOutfitSuccessAction | EquipQualitySuccess | FetchOutfitSuccessAction,
): IOutfitState {
  const { payload } = action;
  return {
    ...state,
    ...payload.slots.reduce(reduceFn, {}),
    dirty: payload.dirty,
    maxOutfits: payload.maxOutfits,
    isChanging: false,
  };
}

function reduceFn(acc: { [key: string]: number | undefined }, next: { name: string, qualityId?: number | undefined }) {
  const { name, qualityId: id } = next;
  return { ...acc, [name.replace(/ /g, '')]: id };
}