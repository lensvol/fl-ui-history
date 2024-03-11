import React, { useCallback, useMemo, useState } from "react";
import { ImageOverlay, Map as LeafletMap } from "react-leaflet";
import { connect } from "react-redux";

import L from "leaflet";

import DistrictLabelLayer from "components/Map/DistrictLabelLayer";
import CompatibilityWarning from "components/Map/FallbackMap/CompatibilityWarning";
import { FallbackMapProps } from "components/Map/FallbackMap/types";
import MapModalTooltipContext from "components/Map/MapModalTooltipContext";
import MapOverlay from "components/Map/MapOverlay";
import PlayerMarkers from "components/Map/PlayerMarkers";
import UnterzeeFallbackAreaOverlay from "components/Map/FallbackMap/UnterzeeFallbackAreaOverlay";
import { ModalTooltip } from "components/ModalTooltip/ModalTooltipContainer";
import { ITooltipData } from "components/ModalTooltip/types";

import {
  getMapDimensionsForSetting,
  getMinimumZoomThatFits,
  xy,
} from "features/mapping";
import getCRSForSetting from "features/mapping/getCRSForSetting";
import getFallbackMapImageURL from "features/mapping/getFallbackMapImageURL";
import getIdealMaximumZoomForSetting from "features/mapping/getIdealMaximumZoomForSetting";
import getIdealMinimumZoomForSetting from "features/mapping/getIdealMinimumZoomForSetting";
import getMinimumZoomLevelForDestinations from "features/mapping/getMinimumZoomLevelForDestinations";

import getLabelledStateAwareAreas from "selectors/map/getLabelledStateAwareAreas";

import { IAppState } from "types/app";
import {
  IHasSprite,
  ILabelledStateAwareArea,
  IMappableSetting,
} from "types/map";

export function UnterzeeFallbackMap(props: FallbackMapProps & StateProps) {
  const {
    areas,
    currentArea,
    initialCenter,
    isModalTooltipOpen,
    onAreaClick,
    onAreaSelect,
    onMoveEnd,
    onZoomEnd,
    setting,
    tooltipData,
    zoomLevel: parentZoomLevel,
  } = props;

  const [zoomLevel, setZoomLevel] = useState(parentZoomLevel);

  const handleZoomEnd = useCallback(
    (e: any) => {
      setZoomLevel(e.target.getZoom());
      onZoomEnd(e);
    },
    [onZoomEnd]
  );

  const labelledAreas = useMemo(
    () => areas.map((a) => a as ILabelledStateAwareArea),
    [areas]
  );
  const areasWithSprites = useMemo(
    () => areas.filter((a) => a.isDrawable).map((a) => a as IHasSprite),
    [areas]
  );

  if (!setting?.mapRootArea) {
    return null;
  }

  const mappableSetting = setting as IMappableSetting;

  const { height: mapHeight, width: mapWidth } =
    getMapDimensionsForSetting(mappableSetting);

  let minZoom: undefined | number;
  let maxZoom: undefined | number;

  if (mappableSetting !== undefined) {
    const minimumZoomThatFits = getMinimumZoomThatFits(window, mappableSetting);

    if (minimumZoomThatFits !== undefined) {
      minZoom = Math.max(
        getIdealMinimumZoomForSetting(mappableSetting) ?? 1,
        minimumZoomThatFits
      );
      maxZoom = Math.max(
        getIdealMaximumZoomForSetting(mappableSetting),
        minZoom
      );
    }
  }

  if (
    mappableSetting === undefined ||
    minZoom === undefined ||
    maxZoom === undefined
  ) {
    return null;
  }

  return (
    <LeafletMap
      attributionControl={false}
      className="leaflet-container--unterzee"
      center={xy(initialCenter[0], initialCenter[1])}
      maxBounds={L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight))}
      minZoom={minZoom}
      maxZoom={maxZoom}
      maxBoundsViscosity={1}
      onmoveend={onMoveEnd}
      onzoomend={handleZoomEnd}
      zoomControl={false}
      zoom={zoomLevel}
      zoomDelta={0.00001}
      zoomSnap={0.00001}
      crs={getCRSForSetting(mappableSetting)}
    >
      <ImageOverlay
        url={getFallbackMapImageURL(mappableSetting)}
        bounds={L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight))}
      />
      <MapOverlay />
      <DistrictLabelLayer
        areas={labelledAreas}
        currentArea={currentArea}
        onAreaClick={onAreaClick}
        onAreaSelect={onAreaSelect}
        onTapAtLowZoomLevel={() => {
          /* no-op */
        }}
        zoomLevel={getMinimumZoomLevelForDestinations(mappableSetting)}
      />
      {areasWithSprites.map((area) => (
        <UnterzeeFallbackAreaOverlay
          key={area.areaKey}
          area={area}
          setting={setting}
        />
      ))}
      <PlayerMarkers />
      <CompatibilityWarning />
      <MapModalTooltipContext.Consumer>
        {({ onRequestClose }) => (
          <ModalTooltip
            modalIsOpen={isModalTooltipOpen}
            onRequestClose={onRequestClose}
            tooltipData={tooltipData}
            disableTouchEvents
          />
        )}
      </MapModalTooltipContext.Consumer>
    </LeafletMap>
  );
}

const mapStateToProps = (state: IAppState) => ({
  areas: getLabelledStateAwareAreas(state),
  setting: state.map.setting,
});

type StateProps = ReturnType<typeof mapStateToProps> & {
  isModalTooltipOpen: boolean;
  tooltipData: ITooltipData;
};

export default connect(mapStateToProps)(UnterzeeFallbackMap);
