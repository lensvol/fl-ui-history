import React, {
  Fragment,
  useCallback,
} from 'react';
import {
  IArea,
  ILabelledStateAwareArea,
  IStateAwareArea,
} from 'types/map';
import { isMapArea } from 'features/mapping';
import MapModalTooltipContext from 'components/Map/MapModalTooltipContext';
import AreaMarker from './AreaMarker';

interface Props {
  areas: ILabelledStateAwareArea[],
  currentArea: IArea,
  minimumZoomLevel?: number,
  onAreaClick: (e: any, area: IArea) => Promise<void>,
  onAreaSelect: (area?: IArea) => void,
  onTapAtLowZoomLevel: (area: IArea) => void,
  tooltipClassName?: string,
  zoomLevel: number,
}

export default function DistrictLabelLayer({
  areas,
  currentArea,
  minimumZoomLevel,
  onAreaClick,
  onAreaSelect,
  onTapAtLowZoomLevel,
  tooltipClassName,
  zoomLevel,
}: Props) {
  const shouldAreaOverrideMinimumZoom = useCallback(
    (area: IStateAwareArea) => area.areaKey === currentArea.areaKey,
    [currentArea],
  );

  const isInteractiveArea = useCallback(() => zoomLevel >= (minimumZoomLevel ?? 0), [minimumZoomLevel, zoomLevel]);

  return (
    <Fragment>
      {areas
        .filter(area => shouldAreaOverrideMinimumZoom(area) || zoomLevel >= (minimumZoomLevel ?? 0))
        .filter(isMapArea)
        .filter(area => !area.shouldHideLabel)
        .map(area => (
          <MapModalTooltipContext.Consumer key={area.areaKey}>
            {({ openModalTooltip }) => (
              <AreaMarker
                area={area}
                className={tooltipClassName}
                currentArea={currentArea}
                interactive={isInteractiveArea()}
                onAreaSelect={onAreaSelect}
                onAreaClick={onAreaClick}
                openModalTooltip={openModalTooltip}
                onTapAtLowZoomLevel={onTapAtLowZoomLevel}
                zoomLevel={zoomLevel}
              />
            )}
          </MapModalTooltipContext.Consumer>
        ))}
    </Fragment>
  );
}

DistrictLabelLayer.displayName = 'DistrictLabelLayer';