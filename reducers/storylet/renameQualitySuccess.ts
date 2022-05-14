import { IStoryletState } from 'types/storylet';

export default function renameQualitySuccess(state: IStoryletState, payload: any): IStoryletState {
  const {
    endStorylet,
    messages,
    phase,
    rename,
  } = payload;
  return {
    ...state,
    endStorylet,
    messages,
    phase,
    rename,
    isRenaming: false,
  };
}