import { ZoomAnimEvent } from 'leaflet';
import { useCallback } from 'react';
import { IStateAwareArea } from 'types/map';

export default function useHandleZoomEnd(
  minimumZoomLevelForDestinations: number,
  onAreaSelect: (_?: any) => void,
  onZoomEnd: (e: ZoomAnimEvent) => void,
  selectedArea: IStateAwareArea | undefined,
  setZoomLevel: (zoomLevel: number) => void,
) {
  return useCallback((e: ZoomAnimEvent) => {
    const zoomLevel = e.target.getZoom();
    setZoomLevel(zoomLevel);
    onZoomEnd(e);

    // Force-deselect if we've zoomed out beyond the threshold for showing destinations
    if (selectedArea?.isDistrict && zoomLevel < minimumZoomLevelForDestinations) {
      onAreaSelect();
    }
  }, [
    minimumZoomLevelForDestinations,
    onAreaSelect,
    onZoomEnd,
    selectedArea,
    setZoomLevel,
  ]);
}
