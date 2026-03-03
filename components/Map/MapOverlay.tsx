import React from "react";

import { ImageOverlay } from "react-leaflet";

import { latLngBounds } from "leaflet";

import { useAppSelector } from "features/app/store";
import { isLit, xy } from "features/mapping";
import getMapOverlayImageURL from "features/mapping/getMapOverlayImageURL";

import getLabelledStateAwareAreas from "selectors/map/getLabelledStateAwareAreas";

import { IMappableSetting } from "types/map";

export default function MapOverlay() {
  const areas = useAppSelector((state) => getLabelledStateAwareAreas(state));
  const mappableSetting = useAppSelector(
    (state) => state.map.setting
  ) as IMappableSetting;

  const overlayData = areas
    .filter((area) => isLit(area) && area.overlayIndex !== undefined)
    .map((area) => ({
      height: area.overlayHeight ?? 0,
      index: area.overlayIndex ?? 0,
      width: area.overlayWidth ?? 0,
      x: area.overlayTopLeftX ?? 0,
      y: area.overlayTopLeftY ?? 0,
    }))
    .map((data) => ({
      bounds: latLngBounds(
        xy(data.x, data.y),
        xy(data.x + data.width, data.y - data.height)
      ),
      key: data.index,
      url: getMapOverlayImageURL(mappableSetting, data.index),
    }))
    .filter((data) => data.url);

  if (overlayData.length === 0) {
    return null;
  }

  return (
    <>
      {overlayData.map((data) => (
        <ImageOverlay
          bounds={data.bounds}
          key={data.key}
          url={data.url!}
          zIndex={90 - data.key}
        />
      ))}
    </>
  );
}

MapOverlay.displayName = "MapOverlay";
