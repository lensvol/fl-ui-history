import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { Polygon } from "react-leaflet";

import classnames from "classnames";

import { useAppSelector } from "features/app/store";
import { getHitboxForArea, xy } from "features/mapping";

import {
  IArea,
  IMappableSetting,
  IStateAwareArea,
  IStateAwareAreaWithHitbox,
} from "types/map";

const DRAG_THRESHOLD = 10; // px movement before we treat this as a drag

type Props = {
  area: IStateAwareAreaWithHitbox;
  onAreaSelect: (area?: IArea) => void;
  onClick: (area: IStateAwareArea) => void;
  zoomLevel: number;
};

export default function Hitbox({
  area,
  onAreaSelect,
  onClick: onParentClick,
  zoomLevel,
}: Props) {
  const setting = useAppSelector(
    (state) => state.map.setting
  ) as IMappableSetting;

  // TODO: Narrow the type here
  const ref = useRef<any>(null);

  const hitbox = useMemo(() => {
    return getHitboxForArea(area, setting, zoomLevel);
  }, [area, setting, zoomLevel]);

  const isDragging = useRef(false);
  const isMouseDown = useRef(false);
  const isTouchActive = useRef(false);
  const isTouchDeactivationDeferred = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const onClick = useCallback(
    (e: any) => {
      if (e._simulated) {
        // eslint-disable-line no-underscore-dangle
        return;
      }

      if (isDragging.current) {
        return;
      }

      if (isTouchDeactivationDeferred.current) {
        isTouchDeactivationDeferred.current = false;
        isTouchActive.current = false;

        return;
      }

      onParentClick(area);
    },
    [area, isDragging, isTouchDeactivationDeferred, onParentClick]
  );

  const onMouseDown = useCallback((e: MouseEvent) => {
    isMouseDown.current = true;
    isDragging.current = false;
    startX.current = e.clientX;
    startY.current = e.clientY;
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging.current || !isMouseDown.current) {
        return;
      }

      const { clientX, clientY } = e;

      if (
        Math.abs(clientX - startX.current) > DRAG_THRESHOLD ||
        Math.abs(clientY - startY.current) > DRAG_THRESHOLD
      ) {
        isDragging.current = true;
      }
    },
    [isDragging, isMouseDown, startX, startY]
  );

  const onMouseOver = useCallback(
    (e) => {
      // Why are we getting mouse overs when touch happens?
      if (e.sourceCapabilities?.firesTouchEvents ?? false) {
        return;
      }

      onAreaSelect(area);
    },
    [area, onAreaSelect]
  );

  const onMouseOut = useCallback(() => {
    onAreaSelect();
  }, [onAreaSelect]);

  const onMouseUp = useCallback(() => {
    isMouseDown.current = false;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (isTouchActive.current) {
      isTouchDeactivationDeferred.current = true; // We will need to deactivate touch in the onClick phase
    }
  }, [isTouchActive]);

  const onTouchStart = useCallback(() => {
    isTouchActive.current = true;
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return () => {
        /* no-op; we can't do anything without ref.current */
      };
    }

    const polygon = ref.current.leafletElement;
    const domElement = polygon.getElement();

    domElement.addEventListener("click", onClick, { passive: true });
    domElement.addEventListener("mousedown", onMouseDown, { passive: true });
    domElement.addEventListener("mousemove", onMouseMove, { passive: true });
    domElement.addEventListener("mouseout", onMouseOut, { passive: true });
    domElement.addEventListener("mouseover", onMouseOver, { passive: true });
    domElement.addEventListener("mouseup", onMouseUp, { passive: true });
    domElement.addEventListener("touchend", onTouchEnd, { passive: true });
    domElement.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      domElement.removeEventListener("click", onClick);
      domElement.removeEventListener("mousedown", onMouseDown);
      domElement.removeEventListener("mousemove", onMouseMove);
      domElement.removeEventListener("mouseout", onMouseOut);
      domElement.removeEventListener("mouseover", onMouseOver);
      domElement.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("touchend", onTouchEnd);
      domElement.removeEventListener("touchstart", onTouchStart);
    };
  }, [
    onClick,
    onMouseDown,
    onMouseMove,
    onMouseOut,
    onMouseOver,
    onMouseUp,
    onTouchEnd,
    onTouchStart,
    ref,
  ]);

  if (!hitbox) {
    return null;
  }

  return (
    <Polygon
      className={classnames(
        area.isLit
          ? "leaflet-interactive--hitbox"
          : "leaflet-interactive--dark-hitbox"
      )}
      fillOpacity={0}
      opacity={0}
      positions={hitbox.map((t: number[]) => xy(t[0], t[1]))}
      ref={ref}
    />
  );
}

Hitbox.displayName = "Hitbox";
