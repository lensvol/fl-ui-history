import { FALLBACK_MAP_PREFERRED } from 'actiontypes/map';
import { Dispatch } from 'redux';

export type SetFallbackMapPreferred = {
  type: typeof FALLBACK_MAP_PREFERRED,
  payload: { value: boolean ,}
};

export function isFallbackMapPreferred(value: boolean): SetFallbackMapPreferred {
  return { type: FALLBACK_MAP_PREFERRED, payload: { value } };
}

export default function setFallbackMapPreferred(value: boolean)  {
  return (dispatch: Dispatch) => dispatch(isFallbackMapPreferred(value));
}