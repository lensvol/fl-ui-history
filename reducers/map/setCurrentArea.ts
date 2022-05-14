import { SetCurrentArea } from 'actions/map/setCurrentArea';
import asStateAwareArea from 'features/mapping/asStateAwareArea';
import {
  IArea,
  IMapState,
  IStateAwareArea,
} from 'types/map';

export default function setCurrentArea(state: IMapState, action: SetCurrentArea): IMapState {
  const { payload } = action;
  const { area } = payload;
  const { moveMessage, showOps } = area;

  // If we already know about this area, then merge the new information with
  // what's already in state
  const existingAreaInState: IStateAwareArea | undefined = state.areas?.find(a => a.id === area.id);
  if (existingAreaInState) {
    const filteredAreaInfo = (Object.keys(area) as Array<keyof Partial<IArea>>)
      .reduce((acc: Partial<IStateAwareArea>, k) => {
        if (area[k] === undefined) {
          return acc;
        }
        return { ...acc, [k]: area[k] };
      }, {});


    const merge: IStateAwareArea = { ...existingAreaInState, ...filteredAreaInfo };

    return {
      ...state,
      moveMessage,
      showOps,
      currentArea: merge, // Merge new information
    };
  }

  // Otherwise, just set the current area to the data we've been given
  return {
    ...state,
    moveMessage,
    showOps,
    currentArea: asStateAwareArea(
      area,
      state.areas ?? [],
      state.setting,
      area,
    ),
  };
}