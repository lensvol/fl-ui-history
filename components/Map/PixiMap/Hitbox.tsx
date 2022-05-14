import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Polygon } from 'react-leaflet';
import classnames from 'classnames';

import {
  IArea,
  IMappableSetting,
  IStateAwareArea,
  IStateAwareAreaWithHitbox,
} from 'types/map';
import {
  getHitboxForArea,
  xy,
} from 'features/mapping';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';

const DRAG_THRESHOLD = 10; // px movement before we treat this as a drag

export function Hitbox({
  area,
  onAreaSelect,
  setting,
  zoomLevel,
  onClick: onParentClick,
}: Props) {
  // TODO: Narrow the type here
  const ref = useRef<any>(null);

  const hitbox = useMemo(() => getHitboxForArea(area, setting, zoomLevel), [area, setting, zoomLevel]);

  const isDragging = useRef(false);
  const isMouseDown = useRef(false);
  const isTouchActive = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const isTouchDeactivationDeferred = useRef(false);

  const onClick = useCallback((e: any) => {
    if (e._simulated) { // eslint-disable-line no-underscore-dangle
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
  }, [area, isTouchDeactivationDeferred, isDragging, onParentClick]);

  const onMouseDown = useCallback((e: MouseEvent) => {
    isMouseDown.current = true;
    isDragging.current = false;
    startX.current = e.clientX;
    startY.current = e.clientY;
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current || !isMouseDown.current) {
      return;
    }
    const { clientX, clientY } = e;
    if (Math.abs(clientX - startX.current) > DRAG_THRESHOLD || Math.abs(clientY - startY.current) > DRAG_THRESHOLD) {
      isDragging.current = true;
    }
  }, [isDragging, isMouseDown, startX, startY]);

  const onMouseOver = useCallback((e) => {
    // Why are we getting mouse overs when touch happens?
    if (e.sourceCapabilities?.firesTouchEvents ?? false) {
      return;
    }
    onAreaSelect(area);
  }, [area, onAreaSelect]);

  const onMouseOut = useCallback(() => onAreaSelect(), [onAreaSelect]);
  const onMouseUp = useCallback(() => { isMouseDown.current = false; }, []);

  const onTouchEnd = useCallback(() => {
    if (isTouchActive.current) {
      isTouchDeactivationDeferred.current = true; // We will need to deactivate touch in the onClick phase
    }
  }, [isTouchActive]);

  const onTouchStart = useCallback(() => {
    isTouchActive.current = true;
  }, []);

  useEffect(() => {
    if (ref.current !== null) {
      const polygon = ref.current.leafletElement;
      const domElement = polygon.getElement();

      domElement.addEventListener('click', onClick, { passive: true });
      domElement.addEventListener('mousedown', onMouseDown, { passive: true });
      domElement.addEventListener('mousemove', onMouseMove, { passive: true });
      domElement.addEventListener('mouseover', onMouseOver, { passive: true });
      domElement.addEventListener('mouseout', onMouseOut, { passive: true });
      domElement.addEventListener('mouseup', onMouseUp, { passive: true });

      domElement.addEventListener('touchend', onTouchEnd, { passive: true });
      domElement.addEventListener('touchstart', onTouchStart, { passive: true });

      return () => {
        domElement.removeEventListener('click', onClick);
        domElement.removeEventListener('mousedown', onMouseDown);
        domElement.removeEventListener('mousemove', onMouseMove);
        domElement.removeEventListener('mouseover', onMouseOver);
        domElement.removeEventListener('mouseout', onMouseOut);
        domElement.removeEventListener('mouseup', onMouseUp);

        domElement.removeEventListener('touchend', onTouchEnd);
        domElement.removeEventListener('touchstart', onTouchStart);
      };
    }
    return () => { /* no-op; we can't do anything without ref.current */ };
  }, [
    ref,
    onClick,
    onMouseDown,
    onMouseMove,
    onMouseOver,
    onMouseOut,
    onMouseUp,
    onTouchEnd,
    onTouchStart,
  ]);

  if (!hitbox) {
    return null;
  }

  return (
    <Polygon
      className={classnames(area.isLit ? 'leaflet-interactive--hitbox' : 'leaflet-interactive--dark-hitbox')}
      ref={ref}
      opacity={0}
      fillOpacity={0}
      positions={hitbox.map((t: number[]) => xy(t[0], t[1]))}
    />
  );
}

Hitbox.displayName = 'Hitbox';

const mapStateToProps = ({ map: { setting } }: IAppState) => ({ setting: setting as IMappableSetting });

export interface Props extends ReturnType<typeof mapStateToProps> {
  area: IStateAwareAreaWithHitbox,
  areas?: IArea[],
  onAreaSelect: (arg0?: IArea) => void,
  onClick: (area: IStateAwareArea) => void,
  zoomLevel: number,
}

export default connect(mapStateToProps)(Hitbox);
