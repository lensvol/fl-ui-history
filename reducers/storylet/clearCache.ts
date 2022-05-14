import { IStoryletState } from 'types/storylet';
import { INITIAL_STATE } from './index';

export default function clearCache(state: IStoryletState): IStoryletState {
  // We need to preserve storylet phase so that usable items don't become unusable
  // because of an outfit change; same with canChangeOutfit
  const {
    canChangeOutfit,
    phase,
  } = state;
  return {
    ...INITIAL_STATE,
    canChangeOutfit,
    phase,
  };
}
