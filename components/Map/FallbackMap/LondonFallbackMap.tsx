import React, { useCallback, useMemo, useState } from "react";

import { ImageOverlay, Map } from "react-leaflet";

import L from "leaflet";

import DistrictLabelLayer from "components/Map/DistrictLabelLayer";
import CompatibilityWarning from "components/Map/FallbackMap/CompatibilityWarning";
import FunnellingIndicator from "components/Map/FallbackMap/FunnellingIndicator";
import { FallbackMapProps } from "components/Map/FallbackMap/types";
import Limbo from "components/Map/Limbo";
import Lodgings from "components/Map/Lodgings/Lodgings";
import MapModalTooltipContext from "components/Map/MapModalTooltipContext";
import ZoomControl from "components/Map/PixiMap/ZoomControl";
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
import getMinimumZoomLevelForDestinations from "features/mapping/getMinimumZoomLevelForDestinations";

import getIsPlayerInLimbo from "selectors/map/getIsPlayerInLimbo";
import getStateAwareAreas from "selectors/map/getStateAwareAreas";

import { ILabelledStateAwareArea, IMappableSetting } from "types/map";

type Props = FallbackMapProps & {
  isModalTooltipOpen: boolean;
  tooltipData: ITooltipData;
};

export default function LondonFallbackMap({
  currentArea,
  initialCenter,
  isModalTooltipOpen,
  onAreaClick,
  onAreaSelect,
  onMoveEnd,
  onZoomEnd,
  selectedArea,
  tooltipData,
  zoomLevel: parentZoomLevel,
}: Props) {
  const areas = useAppSelector((state) => getStateAwareAreas(state));
  const isPlayerInLimbo = useAppSelector((state) => getIsPlayerInLimbo(state));
  const setting = useAppSelector(
    (state) => state.map.setting! as IMappableSetting
  );

  const { height: mapHeight, width: mapWidth } =
    getMapDimensionsForSetting(setting);

  let minZoom: number | undefined;
  let maxZoom: number | undefined;

  if (setting) {
    const minimumZoomThatFits = getMinimumZoomThatFits(window, setting);

    if (minimumZoomThatFits !== undefined) {
      minZoom = Math.max(3.0, minimumZoomThatFits);
      maxZoom = Math.max(3.6, minZoom);
    }
  }

  const labelledAreas = useMemo(() => {
    return areas
      .filter((area) => area.shouldAppearOnMap && area.isLabelled)
      .map((area) => area as ILabelledStateAwareArea);
  }, [areas]);

  const [zoomLevel, setZoomLevel] = useState(parentZoomLevel);

  const handleSetZoomLevelWithZoomControl = useCallback(
    (_: number, direction?: "in" | "out") => {
      if (!direction) {
        return;
      }

      if (direction === "in" && maxZoom !== undefined) {
        setZoomLevel(maxZoom);

        return;
      }

      if (minZoom !== undefined) {
        setZoomLevel(minZoom);
      }
    },
    [maxZoom, minZoom]
  );

  const handleZoomEnd = useCallback(
    (e: any) => {
      setZoomLevel(e.target.getZoom());
      onZoomEnd(e);
    },
    [onZoomEnd]
  );

  return (
    <Map
      attributionControl={false}
      center={xy(initialCenter[0], initialCenter[1])}
      crs={getCRSForSetting(setting)}
      maxBounds={L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight))}
      maxBoundsViscosity={1}
      maxZoom={maxZoom}
      minZoom={minZoom}
      onmoveend={onMoveEnd}
      onzoomend={handleZoomEnd}
      zoom={zoomLevel}
      zoomControl={false}
      zoomDelta={0.6}
      zoomSnap={0.6}
    >
      <ImageOverlay
        bounds={L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight))}
        url={getFallbackMapImageURL(setting)}
      />

      <DistrictLabelLayer
        areas={labelledAreas.filter((a) => a.isDistrict)}
        currentArea={currentArea}
        onAreaClick={onAreaClick}
        onAreaSelect={onAreaSelect}
        onTapAtLowZoomLevel={() => {
          /* no-op */
        }}
        zoomLevel={getMinimumZoomLevelForDestinations(setting)} // Lie to the markers in order to force them to appear
      />

      <DistrictLabelLayer
        areas={labelledAreas.filter((a) => !a.isDistrict)}
        currentArea={currentArea}
        onAreaClick={onAreaClick}
        onAreaSelect={onAreaSelect}
        onTapAtLowZoomLevel={() => {
          /* no-op */
        }}
        zoomLevel={getMinimumZoomLevelForDestinations(setting)} // Lie to the markers in order to force them to appear
      />

      <PlayerMarkers />

      {isPlayerInLimbo && <Limbo />}

      <Lodgings
        fallback
        onAreaClick={onAreaClick}
        onAreaSelect={onAreaSelect}
        selectedArea={selectedArea}
      />

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

      <FunnellingIndicator />

      <CompatibilityWarning />

      <ZoomControl
        maxZoom={maxZoom}
        minZoom={minZoom}
        setting={setting}
        setZoomLevel={handleSetZoomLevelWithZoomControl}
        spriteLoaderProgress={100}
        zoomDelta={0.6}
        zoomLevel={zoomLevel}
      />
    </Map>
  );
}

LondonFallbackMap.displayName = "LondonFallbackMap";
