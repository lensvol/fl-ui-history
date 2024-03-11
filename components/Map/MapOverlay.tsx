import React from "react";
import { ImageOverlay } from "react-leaflet";
import { connect } from "react-redux";

import { latLngBounds } from "leaflet";

import { isLit, xy } from "features/mapping";
import getMapOverlayImageURL from "features/mapping/getMapOverlayImageURL";

import getLabelledStateAwareAreas from "selectors/map/getLabelledStateAwareAreas";

import { IAppState } from "types/app";
import { IMappableSetting } from "types/map";

export function MapOverlay({ areas, setting }: Props) {
  const mappableSetting = setting as IMappableSetting;

  const overlayData = areas
    .filter((area) => isLit(area) && area.overlayIndex !== undefined)
    .map((area) => ({
      x: area.overlayTopLeftX ?? 0,
      y: area.overlayTopLeftY ?? 0,
      width: area.overlayWidth ?? 0,
      height: area.overlayHeight ?? 0,
      index: area.overlayIndex ?? 0,
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

const mapStateToProps = (state: IAppState) => ({
  areas: getLabelledStateAwareAreas(state),
  setting: state.map.setting,
});

type Props = //BaseProps &
  ReturnType<typeof mapStateToProps> & {};

export default connect(mapStateToProps)(MapOverlay);
