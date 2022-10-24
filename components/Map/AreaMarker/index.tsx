import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { connect } from "react-redux";
import { IAppState } from "types/app";
import { IArea, ILabelledArea, IStateAwareArea } from "types/map";
import {
  CircleMarker,
  Tooltip,
  Tooltip as LeafletTooltip,
} from "react-leaflet";

import {
  areaToTooltipData,
  isInteractable,
  shouldZoomOnTapAtZoomLevel,
  xy,
} from "features/mapping";
import classnames from "classnames";
import InteractiveMarker from "components/Map/InteractiveMarker";
import { MapModalTooltipContextValue } from "components/Map/MapModalTooltipContext";

function AreaMarker({
  area,
  className,
  currentArea,
  interactive,
  onAreaClick,
  onAreaSelect,
  onTapAtLowZoomLevel,
  openModalTooltip,
  setting,
  zoomLevel,
}: Props) {
  const ref = useRef<Tooltip>(null);

  const [isTouchActive, setIsTouchActive] = useState(false);
  const [didUserTap, setDidUserTap] = useState(false);

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
      openModalTooltip({ ...tooltipData });
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

  const center = useMemo(() => xy(labelX, labelY), [labelX, labelY]);

  return (
    <Fragment>
      <CircleMarker
        center={center}
        radius={0}
        fillColor="transparent"
        opacity={0}
      >
        <LeafletTooltip
          className={classnames(
            "leaflet-tooltip--fbg",
            isAreaInteractable && area.unlocked
              ? "leaflet-tooltip--fbg-interactable"
              : "leaflet-tooltip--fbg-landmark",
            className
          )}
          direction="center"
          offset={[0, 0]}
          permanent
          opacity={1}
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
        </LeafletTooltip>
      </CircleMarker>
    </Fragment>
  );
}

interface OwnProps
  extends Pick<MapModalTooltipContextValue, "openModalTooltip"> {
  area: IStateAwareArea & ILabelledArea;
  className?: string;
  currentArea: IArea;
  interactive?: boolean;
  onAreaClick: (e: any, area: IArea) => Promise<void>;
  onAreaSelect: (area?: IArea) => void;
  onTapAtLowZoomLevel: (area: IArea) => void;
  zoomLevel: number;
}

const mapStateToProps = ({ map: { setting } }: IAppState) => ({
  setting,
});

export type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(AreaMarker);
