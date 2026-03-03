import React, { useState } from "react";

import LondonPixiMap from "components/Map/PixiMap/LondonPixiMap";
import { BaseProps as Props } from "components/Map/PixiMap/props";
import UnterzeePixiMap from "components/Map/PixiMap/UnterzeePixiMap";

import { useAppSelector } from "features/app/store";
import { isUnterzeeSetting } from "features/mapping";
import { MAP_ROOT_AREA_THE_FIFTH_CITY } from "features/mapping/constants";

export default function PixiMap({
  currentArea,
  initialCenter,
  initialZoom,
  onAreaClick,
  onAreaSelect,
  onClick,
  onHitboxClick,
  onMoveEnd,
  onZoomEnd,
  selectedArea,
  zoomLevel,
}: Props) {
  const setting = useAppSelector((state) => state.map.setting!);

  const [isModalTooltipOpen, setIsModalTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState({});

  if (setting.mapRootArea?.areaKey === MAP_ROOT_AREA_THE_FIFTH_CITY) {
    return (
      <LondonPixiMap
        currentArea={currentArea}
        initialCenter={initialCenter}
        initialZoom={initialZoom}
        onAreaClick={onAreaClick}
        onAreaSelect={onAreaSelect}
        onClick={onClick}
        onHitboxClick={onHitboxClick}
        onMoveEnd={onMoveEnd}
        onZoomEnd={onZoomEnd}
        selectedArea={selectedArea}
        zoomLevel={zoomLevel}
      />
    );
  }

  if (isUnterzeeSetting(setting)) {
    return (
      <UnterzeePixiMap
        currentArea={currentArea}
        initialCenter={initialCenter}
        initialZoom={initialZoom}
        isModalTooltipOpen={isModalTooltipOpen}
        onAreaClick={onAreaClick}
        onAreaSelect={onAreaSelect}
        onClick={onClick}
        onHitboxClick={onHitboxClick}
        onMoveEnd={onMoveEnd}
        onZoomEnd={onZoomEnd}
        selectedArea={selectedArea}
        setIsModalTooltipOpen={setIsModalTooltipOpen}
        setTooltipData={setTooltipData}
        tooltipData={tooltipData}
        zoomLevel={zoomLevel}
      />
    );
  }

  return null;
}

PixiMap.displayName = "PixiMap";
