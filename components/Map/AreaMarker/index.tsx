import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CircleMarker, Tooltip } from "react-leaflet";

import classnames from "classnames";

import InteractiveMarker from "components/Map/InteractiveMarker";
import { MapModalTooltipContextValue } from "components/Map/MapModalTooltipContext";

import { useAppSelector } from "features/app/store";
import {
  areaToTooltipData,
  isInteractable,
  shouldZoomOnTapAtZoomLevel,
  xy,
} from "features/mapping";

import { IArea, ILabelledArea, IStateAwareArea } from "types/map";

interface Props extends Pick<MapModalTooltipContextValue, "openModalTooltip"> {
  area: IStateAwareArea & ILabelledArea;
  className?: string;
  currentArea: IArea;
  interactive?: boolean;
  onAreaClick: (e: any, area: IArea) => Promise<void>;
  onAreaSelect: (area?: IArea) => void;
  onTapAtLowZoomLevel: (area: IArea) => void;
  zoomLevel: number;
}

export default function AreaMarker({
  area,
  className,
  currentArea,
  interactive,
  onAreaClick,
  onAreaSelect,
  onTapAtLowZoomLevel,
  openModalTooltip,
  zoomLevel,
}: Props) {
  const ref = useRef<Tooltip>(null);

  const [isTouchActive, setIsTouchActive] = useState(false);
  const [didUserTap, setDidUserTap] = useState(false);

  const setting = useAppSelector((state) => state.map.setting);

  const onClick = useCallback(() => {
    // Only listen to 'click' events that were fired by taps
    if (!didUserTap) {
      return;
    }

    setDidUserTap(false);

    if (shouldZoomOnTapAtZoomLevel(area, setting, zoomLevel)) {
      onTapAtLowZoomLevel(area);

      return;
    }

    onAreaSelect(area);

    if (area.shouldShowTooltip) {
      const tooltipData = areaToTooltipData(
        area,
        currentArea,
        !!setting?.canTravel,
        onAreaClick
      );

      openModalTooltip({
        ...tooltipData,
      });
    }
  }, [
    area,
    currentArea,
    didUserTap,
    onAreaClick,
    onAreaSelect,
    onTapAtLowZoomLevel,
    openModalTooltip,
    setting,
    zoomLevel,
  ]);

  const onTouchEnd = useCallback(() => {
    if (isTouchActive) {
      setIsTouchActive(false);
      setDidUserTap(true);
    }
  }, [isTouchActive]);

  const onTouchStart = useCallback(() => {
    // We're touching
    setIsTouchActive(true);
    setDidUserTap(false);
  }, []);

  useEffect(() => {
    if (ref.current && ref.current.leafletElement) {
      const el = ref.current.leafletElement.getElement();

      // Add event listeners to the leaflet's DOM element
      if (el) {
        el.addEventListener("click", onClick, { passive: true });
        el.addEventListener("touchend", onTouchEnd, { passive: true });
        el.addEventListener("touchstart", onTouchStart, { passive: true });

        return () => {
          el.removeEventListener("click", onClick);
          el.removeEventListener("touchend", onTouchEnd);
          el.removeEventListener("touchstart", onTouchStart);
        };
      }

      // If we can't get the DOM Element for the marker, return a no-op callback
      return () => {
        /* no-op */
      };
    }

    // If we can't find the ref at all, return a no-op callback
    return () => {
      /* no-op */
    };
  }, [onClick, onTouchEnd, onTouchStart]);

  const { labelX, labelY } = area;

  const isAreaInteractable = isInteractable(area) && (interactive ?? true);

  const center = useMemo(() => {
    return xy(labelX, labelY);
  }, [labelX, labelY]);

  return (
    <CircleMarker
      center={center}
      fillColor="transparent"
      radius={0}
      opacity={0}
    >
      <Tooltip
        className={classnames(
          "leaflet-tooltip--fbg",
          isAreaInteractable && area.unlocked
            ? "leaflet-tooltip--fbg-interactable"
            : "leaflet-tooltip--fbg-landmark",
          className
        )}
        direction="center"
        offset={[0, 0]}
        opacity={1}
        permanent
        ref={ref}
      >
        <InteractiveMarker
          area={area}
          currentArea={currentArea}
          onAreaClick={onAreaClick}
          onAreaSelect={onAreaSelect}
          onTapAtLowZoomLevel={onTapAtLowZoomLevel}
          zoomLevel={zoomLevel}
        />
      </Tooltip>
    </CircleMarker>
  );
}

AreaMarker.displayName = "AreaMarker";
