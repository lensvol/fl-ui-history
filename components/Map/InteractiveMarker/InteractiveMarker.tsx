import isInteractableAtThisZoomLevel from 'features/mapping/isInteractableAtThisZoomLevel';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classnames from 'classnames';
import TippyWrapper from 'components/TippyWrapper';
import BorderFanciness from 'components/Map/AreaMarker/BorderFanciness';
import { SELECTED_LABEL_FILTER_STRING } from 'components/Map/AreaMarker/constants';
import GateIcon from 'components/Map/AreaMarker/GateIcon';
import LockIcon from 'components/Map/AreaMarker/LockIcon';
import { useCursor } from 'components/Map/InteractiveMarker/hooks';
import { MapModalTooltipContextValue } from 'components/Map/MapModalTooltipContext';
import {
  areaToTooltipData,
  isUnterzeeSetting,
  shouldShowBorderFanciness,
  shouldZoomOnTapAtZoomLevel,
} from 'features/mapping';
import getMinimumZoomLevelForDestinations from 'features/mapping/getMinimumZoomLevelForDestinations';
import { connect } from 'react-redux';
import { IAppState } from 'types/app';
import {
  IMappableSetting,
  IStateAwareArea,
} from 'types/map';
import { ContainerProps } from './props';

const DRAG_THRESHOLD = 10; // px movement before we treat this as a drag

export function InteractiveMarker({
  area,
  currentArea,
  fallbackMapPreferred,
  onAreaClick,
  onAreaSelect,
  onTapAtLowZoomLevel,
  openModalTooltip,
  selectedArea,
  setting,
  zoomLevel,
}: Props) {
  const shouldShowGateIcon = useMemo(() => area.shouldShowGateIcon && setting?.canTravel, [area, setting]);
  const shouldShowLockIcon = useMemo(() => area.shouldShowLockIcon && setting?.canTravel, [area, setting]);

  const shouldAreaBeInteractiveAtZoomLevel = useMemo(
    () => isInteractableAtThisZoomLevel(area, setting, zoomLevel),
    [area, setting, zoomLevel],
  );

  const shouldShowBorderFancinessAtZoomLevel = useMemo(
    () => shouldShowBorderFanciness(area, setting, zoomLevel),
    [area, setting, zoomLevel],
  );

  const minZoomLevelForDestinations = useMemo(() => {
    if (!setting?.mapRootArea?.areaKey) {
      return 0;
    }
    return getMinimumZoomLevelForDestinations(setting as IMappableSetting);
  }, [setting]);

  const tooltipData = areaToTooltipData(area, currentArea, !!setting?.canTravel, onAreaClick);

  const isMouseDragging = useRef(false);
  const isMouseDown = useRef(false);
  const isTouchActive = useRef(false);
  const isTouchDragging = useRef(false);

  const [isSelected, setIsSelected] = useState(false);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);

  const ref = useRef<HTMLDivElement>(null);
  const tooltipAnchorRef = useRef<HTMLDivElement>(null);

  const isIsland = useMemo(() => isUnterzeeSetting(setting), [setting]);

  const isVisitableIsland: boolean = useMemo(() => {
    if (!isUnterzeeSetting(setting)) {
      return false;
    }
    return area.visitable ?? false;
  }, [
    area.visitable,
    setting,
  ]);

  const onClick = useCallback((e) => {
    // Mouse is no longer down
    isMouseDown.current = false;

    // If we have dragged while the mouse was down, then don't trigger a click either
    if (isMouseDragging.current) {
      return;
    }

    // This isn't a real click event --- it's a simulated one from Leaflet
    // eslint-disable-next-line no-underscore-dangle
    if (e._simulated) {
      return;
    }

    // If we don't have an onclick callback, then return early
    if (!onAreaClick) {
      return;
    }

    // If we are a landmark, return early
    if (area.isLandmark) {
      return;
    }

    // If we should respond to tap/click at a low zoom level (why would we though?) then do that now
    if (shouldZoomOnTapAtZoomLevel(area, setting, zoomLevel)) {
      if (!isTouchActive.current) {
        onAreaClick(e, area);
      } else {
        onTapAtLowZoomLevel(area);
      }
      return;
    }

    // If the area shouldn't be interactive at this level of zoom, then also return
    if (!isInteractableAtThisZoomLevel(area, setting, zoomLevel)) {
      return;
    }

    // If this was a mouse click (not a tap event), then actually run the onClick callback!
    if (!isTouchActive.current) {
      onAreaClick(e, area);
    }
  }, [
    area,
    isMouseDragging,
    isTouchActive,
    onAreaClick,
    onTapAtLowZoomLevel,
    setting,
    zoomLevel,
  ]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    // Ignore mousemove events when we're not dragging
    if (!isMouseDown.current) {
      return;
    }

    // Check whether we've moved far enough to be considered "dragging"
    const { clientX, clientY } = e;
    isMouseDragging.current = (isMouseDragging.current
      || Math.abs(clientX - dragStartX.current) > DRAG_THRESHOLD
      || Math.abs(clientY - dragStartY.current) > DRAG_THRESHOLD);
  }, [
    isMouseDown,
    isMouseDragging,
    dragStartX,
    dragStartY,
  ]);

  const onMouseDown = useCallback((e) => {
    const { clientX, clientY } = e;
    isMouseDown.current = true;
    isMouseDragging.current = false;
    dragStartX.current = clientX;
    dragStartY.current = clientY;
  }, []);

  const onMouseOut = useCallback(() => {
    onAreaSelect();
    setIsSelected(false);
  }, [
    onAreaSelect,
  ]);

  const onMouseOver = useCallback(() => {
    onAreaSelect(area);
    setIsSelected(true);
  }, [
    area,
    onAreaSelect,
  ]);

  const onTouchEnd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation(); // Don't send this to the parent
    isTouchActive.current = false;
    if (isTouchDragging.current) {
      return;
    }

    if (shouldZoomOnTapAtZoomLevel(area, setting, zoomLevel)) {
      onTapAtLowZoomLevel(area);
      return;
    }

    onAreaSelect(area);

    if (area.shouldShowTooltip) {
      openModalTooltip({ ...tooltipData });
    }
  }, [
    area,
    isTouchDragging,
    onAreaSelect,
    onTapAtLowZoomLevel,
    openModalTooltip,
    setting,
    tooltipData,
    zoomLevel,
  ]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    isTouchDragging.current = (isTouchDragging.current
      || Math.abs(clientX - dragStartX.current) > DRAG_THRESHOLD
      || Math.abs(clientY - dragStartY.current) > DRAG_THRESHOLD);
  }, [
    isTouchDragging,
    dragStartX,
    dragStartY,
  ]);

  const onTouchStart = useCallback((e: TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    isTouchActive.current = true;
    isTouchDragging.current = false;
    dragStartX.current = clientX;
    dragStartY.current = clientY;
  }, []);

  const cursor = useCursor(area, setting, zoomLevel);

  // Don't show the decorated border on destinations below min zoom level, unless we're in fallback mode
  const undecorated = useMemo(
    () => area.isDestination && zoomLevel < minZoomLevelForDestinations && !fallbackMapPreferred,
    [
      area.isDestination,
      fallbackMapPreferred,
      minZoomLevelForDestinations,
      zoomLevel,
    ],
  );

  const isSelectedFromProps = selectedArea?.areaKey === area.areaKey;

  const shouldExhibitSelectionGlow: boolean = useMemo(
    () => (isSelected || isSelectedFromProps)
      && !!setting?.canTravel
      && !area.isLandmark
      && shouldAreaBeInteractiveAtZoomLevel
      && (!area.isDestination || zoomLevel >= minZoomLevelForDestinations),
    [
      area,
      isSelected,
      isSelectedFromProps,
      minZoomLevelForDestinations,
      setting,
      shouldAreaBeInteractiveAtZoomLevel,
      zoomLevel,
    ],
  );

  useEffect(() => {
    const domElement = ref.current;

    if (domElement == null) {
      return () => { /* no-op */ };
    }

    domElement.addEventListener('click', onClick, { passive: true });
    domElement.addEventListener('mousedown', onMouseDown, { passive: true });
    domElement.addEventListener('mousemove', onMouseMove, { passive: true });
    domElement.addEventListener('mouseout', onMouseOut, { passive: true });
    domElement.addEventListener('mouseover', onMouseOver, { passive: true });
    domElement.addEventListener('touchend', onTouchEnd, { passive: false });
    domElement.addEventListener('touchmove', onTouchMove, { passive: true });
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      domElement.removeEventListener('click', onClick);
      domElement.removeEventListener('mousedown', onMouseDown);
      domElement.removeEventListener('mousemove', onMouseMove);
      domElement.removeEventListener('mouseout', onMouseOut);
      domElement.removeEventListener('mouseover', onMouseOver);
      domElement.removeEventListener('touchend', onTouchEnd);
      domElement.removeEventListener('touchmove', onTouchMove);
      domElement.removeEventListener('touchstart', onTouchStart);
    };
  }, [
    onClick,
    onMouseDown,
    onMouseMove,
    onMouseOut,
    onMouseOver,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
  ]);

  const tippyChildComponent = useMemo(() => (
    <div
      ref={tooltipAnchorRef}
      className={classnames(
        'leaflet-tooltip--fbg__name',
        undecorated && 'leaflet-tooltip--fbg__name--no-decoration',
        area.isDistrict && 'leaflet-tooltip--fbg__name--district',
        area.isDestination && 'leaflet-tooltip--fbg__name--destination',
        (area.isLandmark || !setting?.canTravel) && 'leaflet-tooltip--fbg__name--landmark',
        isIsland && 'leaflet-tooltip--fbg__name--island',
        isVisitableIsland && 'leaflet-tooltip--fbg__name--visitable-island',

        (area.isDistrict && !shouldAreaBeInteractiveAtZoomLevel)
        && 'leaflet-tooltip--fbg__name--district--non-interactive',
      )}
      style={{
        boxShadow: (shouldExhibitSelectionGlow) ? '0 0 4px white' : 'none',
        filter: (shouldExhibitSelectionGlow) ? SELECTED_LABEL_FILTER_STRING : undefined,
        transition: 'boxShadow .2s, filter .2s',
      }}
    >
      <div style={{ cursor }}>
        {area.name}
      </div>
    </div>
  ), [
    area,
    cursor,
    isIsland,
    isVisitableIsland,
    setting,
    shouldAreaBeInteractiveAtZoomLevel,
    shouldExhibitSelectionGlow,
    undecorated,
  ]);

  return (
    <>
      <div
        ref={ref}
        style={{
          cursor,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          imageRendering: 'pixelated',
          padding: '16px',
        }}
      >
        {shouldAreaBeInteractiveAtZoomLevel && shouldShowGateIcon && (
          <GateIcon
            area={area}
            selected={shouldExhibitSelectionGlow}
          />
        )}
        {shouldAreaBeInteractiveAtZoomLevel && shouldShowLockIcon && (
          <LockIcon
            area={area}
            selected={shouldExhibitSelectionGlow}
          />
        )}
        {shouldShowBorderFancinessAtZoomLevel && (
          <BorderFanciness
            side="top"
            visible={shouldAreaBeInteractiveAtZoomLevel}
            selected={shouldExhibitSelectionGlow}
          />
        )}

        {tooltipData.description ? (
          <TippyWrapper tooltipData={tooltipData}>
            {tippyChildComponent}
          </TippyWrapper>
        ) : (tippyChildComponent)}

        {shouldShowBorderFancinessAtZoomLevel && (
          <BorderFanciness
            side="bottom"
            visible={shouldAreaBeInteractiveAtZoomLevel}
            selected={isSelected}
          />
        )}
      </div>
    </>
  );
}

const mapStateToProps = ({ map: { fallbackMapPreferred, setting } }: IAppState) => ({
  fallbackMapPreferred,
  setting,
});

type Props = ContainerProps
  & Pick<MapModalTooltipContextValue, 'openModalTooltip'>
  & ReturnType<typeof mapStateToProps>
  & { selectedArea?: IStateAwareArea };

export default connect(mapStateToProps)(InteractiveMarker);
