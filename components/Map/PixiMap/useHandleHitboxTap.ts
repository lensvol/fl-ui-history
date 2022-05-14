import { areaToTooltipData } from 'features/mapping';
import { ITooltipData } from 'components/ModalTooltip/types';
import { useCallback } from 'react';
import { IArea, ISetting } from 'types/map';

export default function useHandleHitboxTap(
  currentArea: IArea,
  minimumZoomLevelForDestinations: number,
  onAreaClick: (e: any, area: IArea) => void,
  onAreaSelect: (area?: IArea) => void,
  setting: ISetting | undefined,
  setIsModalTooltipOpen: (isOpen: boolean) => void,
  setTooltipData: (tooltipData: ITooltipData) => void,
  zoomLevel: number,
  zoomToDistrict: (area: IArea) => void,
) {
  return useCallback((area) => {
    if (area.isDistrict && !area.isLit) {
      return;
    }

    if (area.isDistrict && zoomLevel < minimumZoomLevelForDestinations) {
      return zoomToDistrict(area);
    }

    onAreaSelect(area);

    const baseTooltipData = areaToTooltipData(
      area,
      currentArea,
      !!setting?.canTravel,
      (e) => onAreaClick(e, area),
    );
    setIsModalTooltipOpen(true);

    if (zoomLevel >= minimumZoomLevelForDestinations) {
      return setTooltipData(baseTooltipData);
    }
  }, [
    currentArea,
    minimumZoomLevelForDestinations,
    onAreaClick,
    onAreaSelect,
    setIsModalTooltipOpen,
    setTooltipData,
    setting,
    zoomLevel,
    zoomToDistrict,
  ]);
}