import React, { useCallback, useMemo, useState } from "react";

import { ImageOverlay, Map } from "react-leaflet";

import L from "leaflet";

import DistrictLabelLayer from "components/Map/DistrictLabelLayer";
import CompatibilityWarning from "components/Map/FallbackMap/CompatibilityWarning";
import { FallbackMapProps } from "components/Map/FallbackMap/types";
import UnterzeeFallbackAreaOverlay from "components/Map/FallbackMap/UnterzeeFallbackAreaOverlay";
import MapModalTooltipContext from "components/Map/MapModalTooltipContext";
import MapOverlay from "components/Map/MapOverlay";
import PlayerMarkers from "components/Map/PlayerMarkers";
import { ModalTooltip } from "components/ModalTooltip/ModalTooltipContainer";
import { ITooltipData } from "components/ModalTooltip/types";

import { useAppSelector } from "features/app/store";
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

import {
  IHasSprite,
  ILabelledStateAwareArea,
  IMappableSetting,
} from "types/map";

type Props = FallbackMapProps & {
  isModalTooltipOpen: boolean;
  tooltipData: ITooltipData;
};

export default function UnterzeeFallbackMap({
  currentArea,
  initialCenter,
  isModalTooltipOpen,
  onAreaClick,
  onAreaSelect,
  onMoveEnd,
  onZoomEnd,
  tooltipData,
  zoomLevel: parentZoomLevel,
}: Props) {
  const areas = useAppSelector((state) => getLabelledStateAwareAreas(state));
  const setting = useAppSelector((state) => state.map.setting);

  const [zoomLevel, setZoomLevel] = useState(parentZoomLevel);

  const handleZoomEnd = useCallback(
    (e: any) => {
      setZoomLevel(e.target.getZoom());
      onZoomEnd(e);
    },
    [onZoomEnd]
  );

  const labelledAreas = useMemo(() => {
    return areas.map((a) => a as ILabelledStateAwareArea);
  }, [areas]);

  const areasWithSprites = useMemo(() => {
    return areas.filter((a) => a.isDrawable).map((a) => a as IHasSprite);
  }, [areas]);

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
    <Map
      attributionControl={false}
      center={xy(initialCenter[0], initialCenter[1])}
      className="leaflet-container--unterzee"
      crs={getCRSForSetting(mappableSetting)}
      maxBounds={L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight))}
      maxBoundsViscosity={1}
      maxZoom={maxZoom}
      minZoom={minZoom}
      onmoveend={onMoveEnd}
      onzoomend={handleZoomEnd}
      zoom={zoomLevel}
      zoomControl={false}
      zoomDelta={0.00001}
      zoomSnap={0.00001}
    >
      <ImageOverlay
        bounds={L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight))}
        url={getFallbackMapImageURL(mappableSetting)}
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
          area={area}
          key={area.areaKey}
          setting={setting}
        />
      ))}

      <PlayerMarkers />

      <CompatibilityWarning />

      <MapModalTooltipContext.Consumer>
        {({ onRequestClose }) => (
          <ModalTooltip
            disableTouchEvents
            modalIsOpen={isModalTooltipOpen}
            onRequestClose={onRequestClose}
            tooltipData={tooltipData}
          />
        )}
      </MapModalTooltipContext.Consumer>
    </Map>
  );
}

UnterzeeFallbackMap.displayName = "UnterzeeFallbackMap";
