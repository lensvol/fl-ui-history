import L from 'leaflet';
import { MutableRefObject, useCallback } from 'react';
import { IArea } from 'types/map';

const HITBOX_CLICK_ZOOM_LEVEL = 4;

export default function useZoomToDistrict(mapRef: MutableRefObject<any>) {
  return useCallback((area: IArea) => {
    if (mapRef.current === null) {
      return;
    }
    const destination = new L.LatLng(area.labelY!, area.labelX!);
    mapRef.current.leafletElement.setView(destination, HITBOX_CLICK_ZOOM_LEVEL, { animate: true });
  }, [mapRef]);
}