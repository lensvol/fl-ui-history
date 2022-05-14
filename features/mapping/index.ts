import baseSlugify from '@sindresorhus/slugify';
import { LatLng } from 'leaflet';
import {
  LODGINGS_AREA_ID,
  MAP_ROOT_AREA_THE_FIFTH_CITY,
  MAP_ROOT_AREA_THE_UNTERZEE,
  MAP_ROOT_AREA_THE_UNTERZEE_V2,
  MINIMUM_ZOOM_LEVEL_FOR_DESTINATIONS_BY_MAP_ROOT_AREA_ID,
  SETTING_ID_ABOARD_AT_PORT,
} from 'features/mapping/constants';
import getMinimumZoomLevelForDestinations from 'features/mapping/getMinimumZoomLevelForDestinations';
import {
  IArea,
  IMappableSetting,
  ISetting,
} from 'types/map';

import isDistrict from 'features/mapping/isDistrict';

export { default as isDistrict } from 'features/mapping/isDistrict';
export { default as areaToTooltipData } from 'features/mapping/areaToTooltipData';
export { default as getMapDimensionsForSetting } from 'features/mapping/getMapDimensionsForSetting';
export { default as getMinimumZoomThatFits } from 'features/mapping/getMinimumZoomThatFits';


export const NON_MAP_LOCATION_IDS = [
  2, // Your Lodgings
  15, // a dark place
];

export const xy = (x: number, y: number) => new LatLng(y, x);

export const findParentArea = (area: IArea, areas: IArea[]) => areas.find(
  parent => !!(parent.childAreas || []).find(child => child.areaKey === area.areaKey),
);

export function getHitboxForArea(area: IArea, setting: IMappableSetting, zoomLevel: number): number[][] | undefined {
  const minZoomLevel = MINIMUM_ZOOM_LEVEL_FOR_DESTINATIONS_BY_MAP_ROOT_AREA_ID[setting.mapRootArea.areaKey];
  if (isDistrict(area) && zoomLevel >= minZoomLevel) {
    return area.mainDestinationHitbox;
  }
  return area.hitbox;
}

export const hasHitbox = (area: IArea) => (area.hitbox?.length ?? 0) > 0;

export const isCurrentArea = (area: IArea, currentArea: IArea | undefined) => area.areaKey === currentArea?.areaKey;

export const isDestination = (a?: IArea) => a?.type === 'Destination';

export const isDrawable = (a: Pick<IArea, 'spriteTopLeftX' | 'spriteTopLeftY'>) => (
  a.spriteTopLeftX !== undefined
  && a.spriteTopLeftY !== undefined
);

// Can the user do something with this area?
export const isInteractable = (a: IArea) => a.canMoveTo && (a.unlocked || !!a.gateEvent);

export const isLandmark = (a?: IArea) => (a?.type ?? null) === 'Landmark';

export const isLabelled = (a: IArea) => (a.labelX ?? -1) >= 0 && (a.labelY ?? 1) <= 0;

export function isLit(area: IArea) {
  // A discovered or unlocked area is lit, always
  if (area.discovered || area.unlocked) {
    return true;
  }

  // An undiscovered area is lit if any of its children are discovered
  if (isDistrict(area)) {
    const { childAreas } = area;
    return childAreas
        ?.some(otherArea => !isLandmark(otherArea) && (otherArea.discovered || otherArea.unlocked))
      ?? false;
  }

  // Otherwise it's undiscovered
  return false;
}

export const isLodgings = (a: IArea) => a.id === LODGINGS_AREA_ID;

export const isSubLodgings = (area: IArea, areas: IArea[]) => {
  const lodgings = (areas || []).find(isLodgings);
  if (!lodgings) {
    return false;
  }
  return !!lodgings.childAreas.find(childArea => childArea.id === area.id);
};

export const isMapArea = (a: IArea) => !NON_MAP_LOCATION_IDS.includes(a.id);

export const isMappable = (area: IArea, areas: IArea[]) => {
  // Lodgings and sublodgings aren't drawn on the map
  if (isLodgings(area) || isSubLodgings(area, areas)) {
    return false;
  }
  // Validate coordinates
  return !((area.labelX ?? Number.MIN_SAFE_INTEGER) < 0 || (area.labelY ?? Number.MAX_SAFE_INTEGER) > 0);
};

export const isSelectable = (a?: IArea) => (a?.unlocked ?? false) || (a?.discovered ?? false);

// TODO(sdob): This needs to return false when a child area of the district has been discovered
export const isUndiscoveredDistrict = (a: IArea) => isDistrict(a) && !a.discovered;

export const isUnlockable: (_: IArea) => boolean = (a: IArea) => !!a.gateEvent;

export const isUnterzeePlanningSetting = (s: ISetting | undefined) => (s?.id === SETTING_ID_ABOARD_AT_PORT);

export const isUnterzeeSetting = (s: ISetting | undefined) => (s?.mapRootArea?.areaKey !== undefined) && [
  MAP_ROOT_AREA_THE_UNTERZEE,
  MAP_ROOT_AREA_THE_UNTERZEE_V2,
].indexOf(s.mapRootArea.areaKey) >= 0;

export const shouldAppearOnMap = (a: IArea | undefined) => (a?.labelX ?? Number.MIN_SAFE_INTEGER) > 0
  && (a?.labelY ?? Number.MAX_SAFE_INTEGER) < 0;

export const shouldHideLabel = (a: IArea | undefined) => !!(a?.hideLabel);

export const shouldShowGateIcon = (area: IArea) => !area.unlocked && isUnlockable(area);

export const shouldShowLockIcon = (area: IArea, setting: ISetting | undefined) => {
  // If in the Fifth City, check locked/unlockable status
  if (setting?.mapRootArea?.areaKey === MAP_ROOT_AREA_THE_FIFTH_CITY) {
    return !area.unlocked && !isUnlockable(area);
  }

  // Don't show lock icons elsewhere
  return false;
};

export const shouldShowBorderFanciness = (area: IArea, setting: ISetting | undefined, zoomLevel: number) => {
  if (!setting?.canTravel) {
    return false;
  }

  if (isLandmark(area)) {
    return false;
  }

  if (isDistrict(area)) {
    return true;
  }

  if (!setting?.mapRootArea) {
    return false;
  }

  return zoomLevel >= getMinimumZoomLevelForDestinations(setting as IMappableSetting);
};

export const shouldShowMainDestination = (area: IArea) => isDistrict(area) && area.unlocked;

export const shouldZoomOnTapAtZoomLevel = (area: IArea, setting: ISetting | undefined, zoomLevel: number) => {
  // Only districts zoom in
  if (!isDistrict(area)) {
    return false;
  }

  // No map root area => no map => no zooming the map
  if (!setting?.mapRootArea) {
    return false;
  }

  // Otherwise, are we already zoomed in?
  return zoomLevel < getMinimumZoomLevelForDestinations(setting as IMappableSetting);
};

export const slugify = (name: string) => baseSlugify(
  name
    .replace(/^[Tt]he /, '')
    .replace(/'/, ''),
  {},
);

export const sortByLayer = (a: IArea, b: IArea) => a.zIndex - b.zIndex;

export const sortByLayerWithDestinationsLast = (a: IArea, b: IArea) => {
  if (isDistrict(a) && !isDistrict(b)) {
    return -1;
  }
  if (isDistrict(b) && !isDistrict(a)) {
    return 1;
  }
  return sortByLayer(a, b);
};
