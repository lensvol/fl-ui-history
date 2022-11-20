import DistrictLabelLayer from "components/Map/DistrictLabelLayer";
import CompatibilityWarning from "components/Map/FallbackMap/CompatibilityWarning";
import FunnellingIndicator from "components/Map/FallbackMap/FunnellingIndicator";
import Limbo from "components/Map/Limbo";
import Lodgings from "components/Map/Lodgings/Lodgings";
import PlayerMarkers from "components/Map/PlayerMarkers";
import {
  getMapDimensionsForSetting,
  getMinimumZoomThatFits,
  xy,
} from "features/mapping";
import { ModalTooltip } from "components/ModalTooltip/ModalTooltipContainer";
import { ITooltipData } from "components/ModalTooltip/types";
import L from "leaflet";
import getCRSForSetting from "features/mapping/getCRSForSetting";
import getFallbackMapImageURL from "features/mapping/getFallbackMapImageURL";
import getMinimumZoomLevelForDestinations from "features/mapping/getMinimumZoomLevelForDestinations";
import React, { useCallback, useMemo, useState } from "react";
import { ImageOverlay, Map as LeafletMap } from "react-leaflet";
import { connect } from "react-redux";
import getIsPlayerInLimbo from "selectors/map/getIsPlayerInLimbo";
import getStateAwareAreas from "selectors/map/getStateAwareAreas";
import { IAppState } from "types/app";
import { ILabelledStateAwareArea, IMappableSetting } from "types/map";
import MapModalTooltipContext from "../MapModalTooltipContext";
import { ZoomControl } from "../PixiMap/ZoomControl";
import { FallbackMapProps } from "./types";

type Props = FallbackMapProps &
  ReturnType<typeof mapStateToProps> & {
    isModalTooltipOpen: boolean;
    tooltipData: ITooltipData;
  };

export function LondonFallbackMap(props: Props) {
  const {
    areas,
    currentArea,
    initialCenter,
    isModalTooltipOpen,
    isPlayerInLimbo,
    onAreaClick,
    onAreaSelect,
    onMoveEnd,
    onZoomEnd,
    selectedArea,
    setting,
    tooltipData,
    zoomLevel: parentZoomLevel,
  } = props;

  const { height: mapHeight, width: mapWidth } = getMapDimensionsForSetting({
    mapRootArea: setting.mapRootArea!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
  });

  let minZoom: number | undefined;
  let maxZoom: number | undefined;

  if (setting) {
    const minimumZoomThatFits = getMinimumZoomThatFits(window, setting);
    if (minimumZoomThatFits !== undefined) {
      minZoom = Math.max(3.0, minimumZoomThatFits);
      maxZoom = Math.max(3.6, minZoom);
    }
  }

  // const minZoom: undefined | number = setting ? Math.max(3.0, getMinimumZoomThatFits(window, setting)) : undefined;
  // const maxZoom: undefined | number = setting ? Math.max(3.6, minZoom) : undefined;

  const labelledAreas = useMemo(
    () =>
      areas
        .filter((area) => area.shouldAppearOnMap && area.isLabelled)
        .map((area) => area as ILabelledStateAwareArea),
    [areas]
  );

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
    <LeafletMap
      attributionControl={false}
      center={xy(initialCenter[0], initialCenter[1])}
      maxBounds={L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight))}
      minZoom={minZoom}
      maxZoom={maxZoom}
      maxBoundsViscosity={1}
      onmoveend={onMoveEnd}
      onzoomend={handleZoomEnd}
      zoomControl={false}
      zoom={zoomLevel}
      zoomDelta={0.6}
      zoomSnap={0.6}
      crs={getCRSForSetting(setting)}
    >
      <ImageOverlay
        url={getFallbackMapImageURL(setting)}
        bounds={L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight))}
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
        onAreaClick={onAreaClick}
        onAreaSelect={onAreaSelect}
        selectedArea={selectedArea}
        fallback
      />

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

      <FunnellingIndicator />

      <CompatibilityWarning />

      <ZoomControl
        maxZoom={maxZoom}
        setZoomLevel={handleSetZoomLevelWithZoomControl}
        minZoom={minZoom}
        setting={setting}
        spriteLoaderProgress={100}
        zoomDelta={0.6}
        zoomLevel={zoomLevel}
      />
    </LeafletMap>
  );
}

function mapStateToProps(state: IAppState) {
  return {
    areas: getStateAwareAreas(state),
    setting: state.map.setting! as IMappableSetting, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    isPlayerInLimbo: getIsPlayerInLimbo(state),
  };
}

export default connect(mapStateToProps)(LondonFallbackMap);
