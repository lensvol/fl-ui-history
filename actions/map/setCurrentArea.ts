import { SET_CURRENT_AREA } from 'actiontypes/map';
import { IArea } from 'types/map';

export type SetCurrentArea = {
  type: typeof SET_CURRENT_AREA,
  payload: { area: IArea },
};

export default function setCurrentArea(areaInfo: any): SetCurrentArea {
  const area = { ...areaInfo, ...(areaInfo.jsonInfo ?? {}) };
  return { type: SET_CURRENT_AREA, payload: { area } };
}