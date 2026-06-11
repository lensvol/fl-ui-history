import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ImageOverlay, Map, Pane } from "react-leaflet";

import classnames from "classnames";

import L, { LatLngBounds } from "leaflet";

import DistrictLabelLayer from "components/Map/DistrictLabelLayer";
import Hitbox from "components/Map/PixiMap/Hitbox";
import { BaseProps as Props } from "components/Map/PixiMap/props";
import ZoomControl from "components/Map/PixiMap/ZoomControl";
import PlayerMarkers from "components/Map/PlayerMarkers";
import ReactLeafletPixiOverlay from "components/Map/ReactLeafletPixiOverlay";
import { ModalTooltip } from "components/ModalTooltip/ModalTooltipContainer";

import { useAppSelector } from "features/app/store";
import {
  areaToTooltipData,
  getMapDimensionsForSetting,
  getMinimumZoomThatFits,
  isDistrict,
  xy,
} from "features/mapping";
import {
  MAP_BASE_URL,
  MAP_ROOT_AREA_THE_FIFTH_CITY,
} from "features/mapping/constants";
import getCRSForSetting from "features/mapping/getCRSForSetting";
import getIdealMinimumZoomForSetting from "features/mapping/getIdealMinimumZoomForSetting";
import getMapZoomLimitsForSetting from "features/mapping/getMapZoomLimitsForSetting"; // eslint-disable-line @typescript-eslint/no-unused-vars
import getMinimumZoomLevelForDestinations from "features/mapping/getMinimumZoomLevelForDestinations";
import shouldHaveHitbox from "features/mapping/shouldHaveHitbox";

import getLabelledStateAwareAreas from "selectors/map/getLabelledStateAwareAreas";

import {
  IArea,
  IMappableSetting,
  IStateAwareArea,
  IStateAwareAreaWithHitbox,
} from "types/map";

const SAFE_AREA_PADDING = 10;
const HITBOX_CLICK_ZOOM_LEVEL = 4;

type HitboxProps = {
  areas: IStateAwareAreaWithHitbox[];
  onAreaSelect: (area?: IArea) => void;
  onClick: (area: IStateAwareArea) => void;
  zoomLevel: number;
};

function Hitboxes({ areas, onAreaSelect, onClick, zoomLevel }: HitboxProps) {
  return (
    <>
      {areas.map((area) => (
        <Hitbox
          area={area}
          key={area.areaKey}
          onAreaSelect={onAreaSelect}
          onClick={onClick}
          zoomLevel={zoomLevel}
        />
      ))}
    </>
  );
}

Hitboxes.displayName = "Hitboxes";

const MemoizedHitboxes = React.memo(Hitboxes);

export default function LondonPixiMap({
  currentArea,
  initialCenter,
  initialZoom,
  onAreaClick,
  onAreaSelect,
  onClick,
  onMoveEnd,
  onZoomEnd,
  selectedArea,
}: Props) {
  const areas = useAppSelector((state) => getLabelledStateAwareAreas(state));
  const setting = useAppSelector((state) => state.map.setting);
  const spriteLoaderProgress = useAppSelector(
    (state) => state.spriteLoader.progress
  );

  const mappableSetting = setting as IMappableSetting;

  const { areaKey } = setting?.mapRootArea ?? {};

  const isPlayerInLondon = useMemo(() => {
    return areaKey === MAP_ROOT_AREA_THE_FIFTH_CITY;
  }, [areaKey]);

  const minimumZoomLevelForDestinations =
    getMinimumZoomLevelForDestinations(mappableSetting);

  const { height: mapHeight, width: mapWidth } =
    getMapDimensionsForSetting(mappableSetting);

  const mapRef = useRef<any>(null);
  const overlayRef = useRef<any>(null);

  const [isModalTooltipOpen, setIsModalTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState({});
  const [zoomLevel, setZoomLevel] = useState(initialZoom);

  useEffect(() => {
    if (overlayRef.current !== null) {
      overlayRef.current.redraw({
        payload: {
          selectedArea,
        },
        type: "selectedArea",
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
      // eslint-disable-next-line
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
      // eslint-disable-next-line
    },
    [minimumZoomLevelForDestinations, onAreaSelect, onZoomEnd, selectedArea]
  );

  const maxZoom: number | undefined = useMemo(() => {
    return getMapZoomLimitsForSetting(mappableSetting)?.max;
    // eslint-disable-next-line
  }, [mappableSetting]);

  const minZoom: number | undefined = useMemo(() => {
    const minimumZoomThatFits = getMinimumZoomThatFits(window, mappableSetting);

    if (minimumZoomThatFits === undefined) {
      return undefined;
    }

    const idealMinimumZoom = getIdealMinimumZoomForSetting(mappableSetting);

    return Math.max(idealMinimumZoom!, minimumZoomThatFits);
  }, [mappableSetting]);

  const districtAreas = useMemo(() => {
    return areas.filter((a) => a.isDistrict && a.shouldAppearOnMap);
  }, [areas]);

  const nonDistrictAreas = useMemo(() => {
    return areas.filter((a) => !isDistrict(a) && a.shouldAppearOnMap);
  }, [areas]);

  const areasWithHitboxes = useMemo(() => {
    return areas
      .filter((a) => a.hasHitbox && shouldHaveHitbox(a, setting, zoomLevel))
      .map((a) => a as IStateAwareAreaWithHitbox);
  }, [areas, setting, zoomLevel]);

  const crs = useMemo(() => {
    return getCRSForSetting(mappableSetting);
  }, [mappableSetting]);

  const imageOverlayBounds = useMemo(() => {
    return L.latLngBounds(xy(0, 0), xy(mapWidth, -mapHeight));
  }, [mapHeight, mapWidth]);

  const center = useMemo(() => {
    return xy(initialCenter[0], initialCenter[1]);
  }, [initialCenter]);

  // noinspection PointlessArithmeticExpressionJS
  const maxBounds: LatLngBounds = useMemo(() => {
    const southWest: L.LatLngExpression = [
      0 - SAFE_AREA_PADDING,
      0 + SAFE_AREA_PADDING,
    ];
    const northEast: L.LatLngExpression = [
      -mapHeight + SAFE_AREA_PADDING,
      mapWidth - SAFE_AREA_PADDING,
    ];

    return new L.LatLngBounds(southWest, northEast);
  }, [mapHeight, mapWidth]);

  if (mappableSetting === undefined) {
    return null;
  }

  // noinspection PointlessArithmeticExpressionJS
  return (
    <Map
      attributionControl={false}
      bounceAtZoomLimits={false}
      center={center}
      className={classnames(isPlayerInLondon && "leaflet-container--london")}
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
      zoomSnap={0.5}
    >
      <Pane
        name="LondonPixiMapPane"
        style={{
          zIndex: 99, // Hide this pane if we can show basically anything else
        }}
      >
        <ImageOverlay
          bounds={imageOverlayBounds}
          url={`${MAP_BASE_URL}/london/fallback/london-fallback-dark.jpg`}
        />
      </Pane>

      <ZoomControl
        setting={mappableSetting}
        setZoomLevel={setZoomLevel}
        spriteLoaderProgress={spriteLoaderProgress}
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

LondonPixiMap.displayName = "LondonPixiMap";
