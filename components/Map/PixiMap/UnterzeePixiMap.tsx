import React, { useCallback, useMemo, useRef, useState } from "react";

import { ImageOverlay, Map, Pane } from "react-leaflet";

import L from "leaflet";

import DistrictLabelLayer from "components/Map/DistrictLabelLayer";
import MapOverlay from "components/Map/MapOverlay";
import { BaseProps } from "components/Map/PixiMap/props";
import useHandleAreaClick from "components/Map/PixiMap/useHandleAreaClick";
import useHandleHitboxTap from "components/Map/PixiMap/useHandleHitboxTap";
import useHandleZoomEnd from "components/Map/PixiMap/useHandleZoomEnd";
import useZoomToDistrict from "components/Map/PixiMap/useZoomToDistrict";
import ZoomControl from "components/Map/PixiMap/ZoomControl";
import PlayerMarkers from "components/Map/PlayerMarkers";
import ReactLeafletPixiOverlay from "components/Map/ReactLeafletPixiOverlay";
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
import getIdealMinimumZoomForSetting from "features/mapping/getIdealMinimumZoomForSetting";
import getMapZoomLimitsForSetting from "features/mapping/getMapZoomLimitsForSetting"; // eslint-disable-line @typescript-eslint/no-unused-vars
import getMinimumZoomLevelForDestinations from "features/mapping/getMinimumZoomLevelForDestinations";

import getLabelledStateAwareAreas from "selectors/map/getLabelledStateAwareAreas";

import { IMappableSetting } from "types/map";

const SAFE_AREA_PADDING = 0;

type Props = BaseProps & {
  isModalTooltipOpen: boolean;
  setIsModalTooltipOpen: (isOpen: boolean) => void;
  setTooltipData: (tooltipData: ITooltipData) => void;
  tooltipData: ITooltipData;
};

export default function UnterzeePixiMap({
  currentArea,
  initialCenter,
  initialZoom,
  isModalTooltipOpen,
  onAreaClick,
  onAreaSelect,
  onClick,
  onMoveEnd,
  onZoomEnd,
  selectedArea,
  setIsModalTooltipOpen,
  setTooltipData,
  tooltipData,
}: Props) {
  const areas = useAppSelector((state) => getLabelledStateAwareAreas(state));
  const setting = useAppSelector((state) => state.map.setting);
  const spriteLoaderProgress = useAppSelector(
    (state) => state.spriteLoader.progress
  );

  const mappableSetting = setting as IMappableSetting;

  const mapRef = useRef<any>(null);
  const [zoomLevel, setZoomLevel] = useState(initialZoom);

  const minimumZoomLevelForDestinations = useMemo(() => {
    if (!setting?.mapRootArea?.areaKey) {
      return 0;
    }

    return getMinimumZoomLevelForDestinations(mappableSetting);
    // eslint-disable-next-line
  }, [mappableSetting, setting]);

  const { height: mapHeight, width: mapWidth } = useMemo(() => {
    if (!setting?.mapRootArea?.areaKey) {
      return {
        height: 0,
        width: 0,
      };
    }

    return getMapDimensionsForSetting(mappableSetting);
    // eslint-disable-next-line
  }, [mappableSetting, setting]);

  const maxZoom: undefined | number = useMemo(() => {
    if (!setting?.mapRootArea?.areaKey) {
      return 0;
    }

    return getMapZoomLimitsForSetting(mappableSetting)?.max;
    // eslint-disable-next-line
  }, [mappableSetting, setting]);

  const minZoom: undefined | number = useMemo(() => {
    if (!setting?.mapRootArea?.areaKey) {
      return 0;
    }

    const idealMinimumZoomForSetting =
      getIdealMinimumZoomForSetting(mappableSetting);
    const minimumZoomThatFits = getMinimumZoomThatFits(window, mappableSetting);

    if (
      idealMinimumZoomForSetting === undefined ||
      minimumZoomThatFits === undefined
    ) {
      return undefined;
    }

    return Math.max(idealMinimumZoomForSetting, minimumZoomThatFits);
    // eslint-disable-next-line
  }, [mappableSetting, setting]);

  const handleRequestCloseModalTooltip = useCallback(() => {
    setIsModalTooltipOpen(false);
    onAreaSelect();
  }, [onAreaSelect, setIsModalTooltipOpen]);

  const handleZoomEnd = useHandleZoomEnd(
    minimumZoomLevelForDestinations,
    onAreaSelect,
    onZoomEnd,
    selectedArea,
    setZoomLevel
  );

  const zoomToDistrict = useZoomToDistrict(mapRef);

  const handleAreaClick = useHandleAreaClick(
    minimumZoomLevelForDestinations,
    onAreaClick,
    zoomLevel,
    zoomToDistrict
  );

  const handleHitboxTap = useHandleHitboxTap(
    currentArea,
    minimumZoomLevelForDestinations,
    onAreaClick,
    onAreaSelect,
    setting,
    setIsModalTooltipOpen,
    setTooltipData,
    zoomLevel,
    zoomToDistrict
  );

  const center = useMemo(() => {
    return xy(initialCenter[0], initialCenter[1]);
  }, [initialCenter]);

  const crs = useMemo(() => {
    return getCRSForSetting(mappableSetting);
  }, [mappableSetting]);

  const bounds = useMemo(() => {
    return L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight));
  }, [mapHeight, mapWidth]);

  const maxBounds = useMemo(() => {
    const southWest: L.LatLngExpression = [
      -SAFE_AREA_PADDING,
      SAFE_AREA_PADDING,
    ];
    const northEast: L.LatLngExpression = [
      -mapHeight + SAFE_AREA_PADDING,
      mapWidth - SAFE_AREA_PADDING,
    ];

    return L.latLngBounds(southWest, northEast);
  }, [mapHeight, mapWidth]);

  const hideZoomControl = setting?.jsonInfo?.hideZoomControl ?? false;

  if (!setting?.mapRootArea?.areaKey) {
    return null;
  }

  // noinspection PointlessArithmeticExpressionJS
  return (
    <Map
      attributionControl={false}
      bounceAtZoomLimits={false}
      center={center}
      className="leaflet-container--unterzee"
      crs={crs}
      maxBounds={maxBounds}
      maxBoundsViscosity={1}
      maxZoom={maxZoom}
      minZoom={minZoom}
      onclick={onClick}
      onmoveend={onMoveEnd}
      onzoomend={handleZoomEnd}
      ref={mapRef}
      tms={false}
      zoom={zoomLevel}
      zoomControl={false}
      zoomDelta={0.5}
      zoomSnap={0.000001}
    >
      <Pane
        name="UnterzeePixiMapPane"
        style={{
          zIndex: 99, // Hide this pane if we can show basically anything else
        }}
      >
        <ImageOverlay
          bounds={bounds}
          url={getFallbackMapImageURL(mappableSetting)}
        />
        <MapOverlay />
      </Pane>

      {!hideZoomControl && (
        <ZoomControl
          setting={mappableSetting}
          setZoomLevel={setZoomLevel}
          spriteLoaderProgress={spriteLoaderProgress}
          zoomDelta={0.3}
          zoomLevel={zoomLevel}
        />
      )}

      <ReactLeafletPixiOverlay
        // This is a hack to work around the fact that TS doesn't recognise that ReactLeafletPixiOverlay
        // can take `selectedArea` as a prop; it's not an excess property but relates to this issue:
        // https://github.com/Microsoft/TypeScript/issues/15463
        // {...{ selectedArea }}
        // @ts-ignore
        selectedArea={selectedArea}
      />

      <DistrictLabelLayer
        areas={areas}
        currentArea={currentArea}
        onAreaClick={handleAreaClick}
        onAreaSelect={onAreaSelect}
        onTapAtLowZoomLevel={handleHitboxTap}
        tooltipClassName="leaflet-tooltip--fbg__name--unterzee-landmark"
        zoomLevel={zoomLevel}
      />

      <PlayerMarkers />

      <ModalTooltip
        disableTouchEvents
        modalIsOpen={isModalTooltipOpen}
        onRequestClose={handleRequestCloseModalTooltip}
        tooltipData={tooltipData}
      />
    </Map>
  );
}

UnterzeePixiMap.displayName = "UnterzeePixiMap";
