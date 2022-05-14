import { SetCurrentSetting } from 'actions/map/setCurrentSetting';
import { IMapState } from 'types/map';

export default function setCurrentSetting(state: IMapState, action: SetCurrentSetting): IMapState {
  return {
    ...state,
    setting: action.payload,
  };
}
