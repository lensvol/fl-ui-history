import { isDistrict } from 'features/mapping';
import { SyntheticEvent, useCallback } from 'react';
import { IArea } from 'types/map';

export default function useHandleAreaClick(
  minimumZoomLevelForDestinations: number,
  onAreaClick: (e: any, area: IArea) => void,
  zoomLevel: number,
  zoomToDistrict: (area: IArea) => void,
) {
  return useCallback(async (e: SyntheticEvent<Element, Event>, area: IArea) => {
    if (isDistrict(area) && zoomLevel < minimumZoomLevelForDestinations) {
      zoomToDistrict(area);
      return;
    }
    await onAreaClick(e, area);
  }, [
    minimumZoomLevelForDestinations,
    onAreaClick,
    zoomLevel,
    zoomToDistrict,
  ]);
}