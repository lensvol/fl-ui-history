import shouldHaveHitbox from "features/mapping/shouldHaveHitbox";
import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classnames from "classnames";
import {
  MAP_BASE_URL,
  MAP_ROOT_AREA_THE_FIFTH_CITY,
} from "features/mapping/constants";
import DistrictLabelLayer from "components/Map/DistrictLabelLayer";
import { BaseProps } from "components/Map/PixiMap/props";
import ZoomControl from "components/Map/PixiMap/ZoomControl";
import ReactLeafletPixiOverlay from "components/Map/ReactLeafletPixiOverlay";
import {
  areaToTooltipData,
  getMapDimensionsForSetting,
  getMinimumZoomThatFits,
  isDistrict,
  xy,
} from "features/mapping";
import { ModalTooltip } from "components/ModalTooltip/ModalTooltipContainer";
import L, { LatLngBounds } from "leaflet";
import getCRSForSetting from "features/mapping/getCRSForSetting";
import getMapZoomLimitsForSetting from "features/mapping/getMapZoomLimitsForSetting";
import getMinimumZoomLevelForDestinations from "features/mapping/getMinimumZoomLevelForDestinations";
import { ImageOverlay, Map as LeafletMap, Pane } from "react-leaflet";
import { connect } from "react-redux";
import getLabelledStateAwareAreas from "selectors/map/getLabelledStateAwareAreas";
import { IAppState } from "types/app";
import {
  IArea,
  IMappableSetting,
  IStateAwareArea,
  IStateAwareAreaWithHitbox,
} from "types/map";
import PlayerMarkers from "../PlayerMarkers";
import Hitbox from "./Hitbox";

const SAFE_AREA_PADDING = 10;
const HITBOX_CLICK_ZOOM_LEVEL = 4;

function Hitboxes({
  areas,
  onClick,
  onAreaSelect,
  zoomLevel,
}: {
  areas: IStateAwareAreaWithHitbox[];
  onAreaSelect: (arg0?: IArea) => void;
  onClick: (area: IStateAwareArea) => void;
  zoomLevel: number;
}) {
  return (
    <>
      {areas.map((area) => (
        <Hitbox
          key={area.areaKey}
          area={area}
          onAreaSelect={onAreaSelect}
          onClick={onClick}
          zoomLevel={zoomLevel}
        />
      ))}
    </>
  );
}

const MemoizedHitboxes = React.memo(Hitboxes);

export function LondonPixiMap(props: Props) {
  const {
    areas,
    currentArea,
    initialCenter,
    initialZoom,
    onAreaClick,
    onAreaSelect,
    onClick,
    onMoveEnd,
    onZoomEnd,
    selectedArea,
    setting,
  } = props;

  const { areaKey } = setting?.mapRootArea ?? {};

  const isPlayerInLondon = useMemo(
    () => areaKey === MAP_ROOT_AREA_THE_FIFTH_CITY,
    [areaKey]
  );

  const minimumZoomLevelForDestinations = getMinimumZoomLevelForDestinations(
    setting as IMappableSetting
  );

  const { height: mapHeight, width: mapWidth } = getMapDimensionsForSetting(
    setting as IMappableSetting
  );

  const mapRef = useRef<any>(null);
  const overlayRef = useRef<any>(null);

  const [isModalTooltipOpen, setIsModalTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState({});
  const [zoomLevel, setZoomLevel] = useState(initialZoom);

  useEffect(() => {
    if (overlayRef.current !== null) {
      overlayRef.current.redraw({
        type: "selectedArea",
        payload: { selectedArea },
      });
    }
  }, [selectedArea]);

  const zoomToDistrict = useCallback((area: IArea) => {
    // If we have no map, we can't zoom it; return
    if (mapRef.current === null) {
      return;
    }
    // If we have no label coordinates, we can't zoom anywhere; return
    if (area.labelX === undefined || area.labelY === undefined) {
      return;
    }
    const destination = xy(area.labelX, area.labelY);
    mapRef.current.leafletElement.setView(
      destination,
      HITBOX_CLICK_ZOOM_LEVEL,
      { animate: true }
    );
  }, []);

  const handleAreaClick = useCallback(
    async (e: SyntheticEvent<Element, Event>, area: IArea) => {
      if (isDistrict(area) && zoomLevel < minimumZoomLevelForDestinations) {
        zoomToDistrict(area);
        return;
      }
      await onAreaClick(e, area);
    },
    [minimumZoomLevelForDestinations, onAreaClick, zoomLevel, zoomToDistrict]
  );

  const handleHitboxClick = useCallback(
    (area: IStateAwareArea) => {
      if (area.isDistrict && !area.isLit) {
        return;
      }
      if (mapRef.current === null) {
        return;
      }
      // We need to handle the hitbox click slightly differently, depending on zoom level.
      // If we are zoomed way out, then we zoom in. Otherwise, we move to the area.
      if (zoomLevel < minimumZoomLevelForDestinations) {
        zoomToDistrict(area);
        return;
      }

      onAreaClick(null, area);
    },
    [minimumZoomLevelForDestinations, onAreaClick, zoomLevel, zoomToDistrict]
  );

  const handleHitboxTap = useCallback(
    (area) => {
      if (area.isDistrict && !area.isLit) {
        return;
      }

      if (area.isDistrict && zoomLevel < minimumZoomLevelForDestinations) {
        zoomToDistrict(area);
        return;
      }

      onAreaSelect(area);

      const baseTooltipData = areaToTooltipData(
        area,
        currentArea,
        !!setting?.canTravel,
        (e) => onAreaClick(e, area)
      );
      setIsModalTooltipOpen(true);

      if (zoomLevel >= minimumZoomLevelForDestinations) {
        setTooltipData(baseTooltipData);
      }
    },
    [
      currentArea,
      minimumZoomLevelForDestinations,
      onAreaClick,
      onAreaSelect,
      setting,
      zoomLevel,
      zoomToDistrict,
    ]
  );

  const handleRequestCloseModalTooltip = useCallback(() => {
    setIsModalTooltipOpen(false);
    onAreaSelect();
  }, [onAreaSelect]);

  const handleZoomEnd = useCallback(
    (e) => {
      const newZoomLevel = e.target.getZoom();
      setZoomLevel(newZoomLevel);
      onZoomEnd(e);

      // Force-deselect if we've zoomed out beyond the threshold for showing destinations
      if (
        selectedArea?.isDistrict &&
        newZoomLevel < minimumZoomLevelForDestinations
      ) {
        onAreaSelect();
      }
    },
    [minimumZoomLevelForDestinations, onAreaSelect, onZoomEnd, selectedArea]
  );

  const maxZoom: number | undefined = useMemo(
    () => getMapZoomLimitsForSetting(setting as IMappableSetting)?.max,
    [setting]
  );

  const minZoom: number | undefined = useMemo(() => {
    const minimumZoomThatFits = getMinimumZoomThatFits(
      window,
      setting as IMappableSetting
    );
    if (minimumZoomThatFits === undefined) {
      return undefined;
    }
    return Math.max(3, minimumZoomThatFits);
  }, [setting]);

  const districtAreas = useMemo(
    () => areas.filter((a) => a.isDistrict && a.shouldAppearOnMap),
    [areas]
  );
  const nonDistrictAreas = useMemo(
    () => areas.filter((a) => !isDistrict(a) && a.shouldAppearOnMap),
    [areas]
  );

  const areasWithHitboxes = useMemo(
    () =>
      areas
        .filter((a) => a.hasHitbox && shouldHaveHitbox(a, setting, zoomLevel))
        .map((a) => a as IStateAwareAreaWithHitbox),
    [areas, setting, zoomLevel]
  );

  const crs = useMemo(
    () => getCRSForSetting(setting as IMappableSetting),
    [setting]
  );

  const imageOverlayBounds = useMemo(
    () => L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight)),
    [mapHeight, mapWidth]
  );

  const center = useMemo(
    () => xy(initialCenter[0], initialCenter[1]),
    [initialCenter]
  );

  // noinspection PointlessArithmeticExpressionJS
  const maxBounds: LatLngBounds = useMemo(
    () =>
      new L.LatLngBounds(
        [0 - SAFE_AREA_PADDING, 0 + SAFE_AREA_PADDING],
        [-mapHeight + SAFE_AREA_PADDING, mapWidth - SAFE_AREA_PADDING]
      ),
    [mapHeight, mapWidth]
  );

  if ((setting as IMappableSetting) === undefined) {
    return null;
  }

  // noinspection PointlessArithmeticExpressionJS
  return (
    <LeafletMap
      ref={mapRef}
      attributionControl={false}
      maxBounds={maxBounds}
      bounceAtZoomLimits={false}
      maxBoundsViscosity={1}
      center={center}
      crs={crs}
      zoom={zoomLevel}
      minZoom={minZoom}
      maxZoom={maxZoom}
      zoomDelta={0.5}
      zoomSnap={0.5}
      onClick={onClick}
      onmoveend={onMoveEnd}
      onzoomend={handleZoomEnd}
      tms={false}
      zoomControl={false}
      className={classnames(isPlayerInLondon && "leaflet-container--london")}
    >
      <Pane
        style={{ zIndex: 99 }} // Hide this pane if we can show basically anything else
      >
        <ImageOverlay
          url={`${MAP_BASE_URL}/london/fallback/london-fallback-dark.jpg`}
          bounds={imageOverlayBounds}
        />
      </Pane>

      <ZoomControl
        setZoomLevel={setZoomLevel}
        zoomLevel={zoomLevel}
        zoomDelta={0.3}
      />

      <ReactLeafletPixiOverlay
        // @ts-ignore
        selectedArea={selectedArea}
      />

      <MemoizedHitboxes
        areas={areasWithHitboxes}
        onAreaSelect={onAreaSelect}
        onClick={handleHitboxClick}
        zoomLevel={zoomLevel}
      />

      <DistrictLabelLayer
        areas={districtAreas}
        currentArea={currentArea}
        onAreaClick={handleAreaClick}
        onAreaSelect={onAreaSelect}
        onTapAtLowZoomLevel={handleHitboxTap}
        zoomLevel={zoomLevel}
      />

      <DistrictLabelLayer
        areas={nonDistrictAreas}
        currentArea={currentArea}
        minimumZoomLevel={minimumZoomLevelForDestinations}
        onAreaClick={onAreaClick}
        onAreaSelect={onAreaSelect}
        onTapAtLowZoomLevel={handleHitboxTap}
        zoomLevel={zoomLevel}
      />

      {/* <PlayerMarkerLayer /> */}
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
  // setting: state.map.setting! as IMappableSetting,
});

type Props = BaseProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(LondonPixiMap);
