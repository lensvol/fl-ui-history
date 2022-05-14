import { shouldShowTooltip } from 'features/mapping/helpers';
import {
  findParentArea,
  hasHitbox,
  isCurrentArea,
  isDestination,
  isDistrict,
  isDrawable,
  isLabelled,
  isLandmark,
  isLit,
  isMappable,
  shouldAppearOnMap,
  shouldHideLabel,
  shouldShowGateIcon,
  shouldShowLockIcon,
  shouldShowMainDestination,
} from 'features/mapping/index';

import {
  IArea,
  ISetting,
  IStateAwareArea,
} from 'types/map';


export default function asStateAwareArea(
  area: IArea, areas: IArea[],
  setting: ISetting | undefined,
  currentArea: IArea | undefined,
): IStateAwareArea {
  return {
    ...area,
    shouldShowTravelButton: area.shouldShowTravelButton ?? true,
    travelButtonLabel: area.travelButtonLabel,
    // getHitboxForZoomLevel: (currentSetting, zoomLevel) => getHitboxForArea(area, currentSetting, zoomLevel),
    hasHitbox: hasHitbox(area),
    isCurrentArea: isCurrentArea(area, currentArea),
    isDestination: isDestination(area),
    isDistrict: isDistrict(area),
    isDrawable: isDrawable(area),
    isLabelled: isLabelled(area),
    isLandmark: isLandmark(area),
    isLit: isLit(area),
    isMappable: isMappable(area, areas),
    parentArea: findParentArea(area, areas),
    shouldAppearOnMap: shouldAppearOnMap(area),
    shouldHideLabel: shouldHideLabel(area),
    // shouldBeInteractiveAtZoomLevel: zoomLevel => isInteractableAtThisZoomLevel(area, setting, zoomLevel),
    // shouldHaveHitboxAtZoomLevel: zoomLevel => shouldHaveHitbox(area, setting, zoomLevel),
    // shouldShowBorderFancinessAtZoomLevel: zoomLevel => shouldShowBorderFanciness(area, setting, zoomLevel),
    shouldShowGateIcon: shouldShowGateIcon(area),
    shouldShowLockIcon: shouldShowLockIcon(area, setting),
    shouldShowMainDestination: shouldShowMainDestination(area),
    shouldShowTooltip: shouldShowTooltip(area, setting),
    // shouldZoomOnTapAtZoomLevel: zoomLevel => shouldZoomOnTapAtZoomLevel(area, setting, zoomLevel),
  };
}
