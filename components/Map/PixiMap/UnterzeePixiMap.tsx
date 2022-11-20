import ZoomControl from "components/Map/PixiMap/ZoomControl";
import getFallbackMapImageURL from "features/mapping/getFallbackMapImageURL";
import React, { useCallback, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { ImageOverlay, Map as LeafletMap, Pane } from "react-leaflet";
import { connect } from "react-redux";

import DistrictLabelLayer from "components/Map/DistrictLabelLayer";
import useHandleAreaClick from "components/Map/PixiMap/useHandleAreaClick";
import useHandleHitboxTap from "components/Map/PixiMap/useHandleHitboxTap";
import useZoomToDistrict from "components/Map/PixiMap/useZoomToDistrict";
import ReactLeafletPixiOverlay from "components/Map/ReactLeafletPixiOverlay";
import {
  getMapDimensionsForSetting,
  getMinimumZoomThatFits,
  xy,
} from "features/mapping";
import { ModalTooltip } from "components/ModalTooltip/ModalTooltipContainer";
import { ITooltipData } from "components/ModalTooltip/types";
import getCRSForSetting from "features/mapping/getCRSForSetting";
import getIdealMinimumZoomForSetting from "features/mapping/getIdealMinimumZoomForSetting";
import getMapZoomLimitsForSetting from "features/mapping/getMapZoomLimitsForSetting";
import getMinimumZoomLevelForDestinations from "features/mapping/getMinimumZoomLevelForDestinations";
import getLabelledStateAwareAreas from "selectors/map/getLabelledStateAwareAreas";
import { IAppState } from "types/app";
import { IMappableSetting } from "types/map";
import { BaseProps } from "./props";

import useHandleZoomEnd from "./useHandleZoomEnd";
import PlayerMarkers from "../PlayerMarkers";

const SAFE_AREA_PADDING = 0;

export function UnterzeePixiMap({
  areas,
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
  setting,
  tooltipData,
}: Props) {
  const mapRef = useRef<any>(null);
  const [zoomLevel, setZoomLevel] = useState(initialZoom);

  const minimumZoomLevelForDestinations = useMemo(() => {
    if (!setting?.mapRootArea?.areaKey) {
      return 0;
    }
    return getMinimumZoomLevelForDestinations(setting as IMappableSetting);
  }, [setting]);

  const { height: mapHeight, width: mapWidth } = useMemo(() => {
    if (!setting?.mapRootArea?.areaKey) {
      return { height: 0, width: 0 };
    }
    return getMapDimensionsForSetting(setting as IMappableSetting);
  }, [setting]);

  const maxZoom: undefined | number = useMemo(() => {
    if (!setting?.mapRootArea?.areaKey) {
      return 0;
    }
    return getMapZoomLimitsForSetting(setting as IMappableSetting)?.max;
  }, [setting]);

  const minZoom: undefined | number = useMemo(() => {
    if (!setting?.mapRootArea?.areaKey) {
      return 0;
    }

    const idealMinimumZoomForSetting = getIdealMinimumZoomForSetting(
      setting as IMappableSetting
    );
    const minimumZoomThatFits = getMinimumZoomThatFits(
      window,
      setting as IMappableSetting
    );

    if (
      idealMinimumZoomForSetting === undefined ||
      minimumZoomThatFits === undefined
    ) {
      return undefined;
    }

    return Math.max(idealMinimumZoomForSetting, minimumZoomThatFits);
  }, [setting]);

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

  const center = useMemo(
    () => xy(initialCenter[0], initialCenter[1]),
    [initialCenter]
  );
  const crs = useMemo(
    () => getCRSForSetting(setting as IMappableSetting),
    [setting]
  );
  const bounds = useMemo(
    () => L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight)),
    [mapWidth, mapHeight]
  );

  const maxBounds = useMemo(
    () =>
      L.latLngBounds(
        [-SAFE_AREA_PADDING, SAFE_AREA_PADDING],
        [-mapHeight + SAFE_AREA_PADDING, mapWidth - SAFE_AREA_PADDING]
      ),
    [mapHeight, mapWidth]
  );

  if (!setting?.mapRootArea?.areaKey) {
    return null;
  }

  const mappableSetting = setting as IMappableSetting;

  // noinspection PointlessArithmeticExpressionJS
  return (
    <LeafletMap
      ref={mapRef}
      attributionControl={false}
      maxBounds={maxBounds}
      bounceAtZoomLimits={false}
      className="leaflet-container--unterzee"
      maxBoundsViscosity={1}
      center={center}
      crs={crs}
      zoom={zoomLevel}
      minZoom={minZoom}
      maxZoom={maxZoom}
      zoomDelta={0.5}
      zoomSnap={0.000001}
      onClick={onClick}
      onmoveend={onMoveEnd}
      onzoomend={handleZoomEnd}
      tms={false}
      zoomControl={false}
    >
      <Pane
        style={{ zIndex: 99 }} // Hide this pane if we can show basically anything else
      >
        <ImageOverlay
          url={getFallbackMapImageURL(mappableSetting)}
          bounds={bounds}
        />
      </Pane>

      <ZoomControl
        setZoomLevel={setZoomLevel}
        zoomLevel={zoomLevel}
        zoomDelta={0.3}
      />

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
        modalIsOpen={isModalTooltipOpen}
        onRequestClose={handleRequestCloseModalTooltip}
        tooltipData={tooltipData}
        disableTouchEvents
      />
    </LeafletMap>
  );
}

const mapStateToProps = (state: IAppState) => ({
  areas: getLabelledStateAwareAreas(state),
  setting: state.map.setting,
});

type Props = BaseProps &
  ReturnType<typeof mapStateToProps> & {
    isModalTooltipOpen: boolean;
    setIsModalTooltipOpen: (isOpen: boolean) => void;
    setTooltipData: (tooltipData: ITooltipData) => void;
    tooltipData: ITooltipData;
  };

export default connect(mapStateToProps)(UnterzeePixiMap);
