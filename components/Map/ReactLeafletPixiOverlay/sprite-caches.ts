import { MAP_ROOT_AREA_THE_FIFTH_CITY } from "features/mapping/constants";
import * as PIXI from "pixi.js";

import { IArea, IStateAwareArea, SpriteType } from "types/map";
import { getMapDimensionsForSetting, isDistrict } from "features/mapping";
import GlobalSpriteMap from "components/Map/PixiMap/GlobalSpriteMap";
import getPositionForSprite from "features/mapping/getPositionForSprite";
import {
  getPixiContainer,
  getPixiMainRenderer,
  clearPixiContainer,
} from "./PixiSingletons";

export const AVAILABLE_SPRITE_CACHE: { [key: string]: PIXI.Sprite } = {};
export const FIXED_SPRITE_CACHE: { [key: string]: PIXI.Sprite } = {};
export const SELECTION_SPRITE_CACHE: { [key: string]: PIXI.Sprite } = {};
export const MAIN_DESTINATION_SPRITE_CACHE: { [key: string]: PIXI.Sprite } = {};
export const MAIN_DESTINATION_SELECTION_SPRITE_CACHE: {
  [key: string]: PIXI.Sprite;
} = {};

const FOREGROUND_STALAGMITE_SPRITE_HEIGHT = 510;

export function addForegroundStalagmiteSprite(
  sprite: PIXI.Sprite,
  aOrB: string
) {
  /* eslint-disable no-param-reassign */
  const { width: mapWidth, height: mapHeight } = getMapDimensionsForSetting({
    mapRootArea: { areaKey: MAP_ROOT_AREA_THE_FIFTH_CITY },
  });
  sprite.scale = new PIXI.Point(0.5, 0.5);
  const y = mapHeight / 2 - FOREGROUND_STALAGMITE_SPRITE_HEIGHT / 2;
  if (aOrB === "a" || aOrB === "stalagmites-a") {
    sprite.position = new PIXI.Point(0, y);
  } else {
    sprite.position = new PIXI.Point(mapWidth / 4, y);
  }
  getPixiContainer().addChild(sprite);
  /* eslint-enable no-param-reassign */
}

export async function addAreaSpriteToContainer(
  area: IArea,
  spriteType: SpriteType
) {
  const pixiContainer = getPixiContainer();
  // Sprite has already been added, go away
  if (isSpriteInCache(area, spriteType)) {
    // console.info(`Sprite for ${area.areaKey} is in cache, not redrawing`);
    return;
  }

  // Only districts have main destination art
  if (
    !isDistrict(area) &&
    (spriteType === "main-destination" ||
      spriteType === "main-destination-selection")
  ) {
    return;
  }

  const sprite = await getSpriteFromCache(area, spriteType);

  if (sprite) {
    sprite.position = getPositionForSprite(area, spriteType);
    pixiContainer.addChild(sprite);
  } else {
    // throw new Error(`Cache miss on ${area.areaKey}:${spriteType}`);
    console.warn(`Cache miss on ${area.areaKey}:${spriteType}`);
  }
}

/**
 * Clear the PIXI container (removing all children) and empty the sprite caches, so that when we
 * next draw the map we'll add all areas.
 *
 * This refreshes the map when we change Setting.
 */
export function clearContainerAndCaches() {
  console.info("SpriteCache.clearContainerAndCaches()");
  clearPixiContainer();
  clearCaches();
}

function clearCaches() {
  [
    AVAILABLE_SPRITE_CACHE,
    FIXED_SPRITE_CACHE,
    MAIN_DESTINATION_SPRITE_CACHE,
    MAIN_DESTINATION_SELECTION_SPRITE_CACHE,
    SELECTION_SPRITE_CACHE,
  ].forEach((cache) => Object.keys(cache).forEach((key) => delete cache[key]));
}

export function getCacheForSpriteType(whatKind: SpriteType) {
  switch (whatKind) {
    case "available":
      return AVAILABLE_SPRITE_CACHE;
    case "selection":
      return SELECTION_SPRITE_CACHE;
    case "main-destination-selection":
      return MAIN_DESTINATION_SELECTION_SPRITE_CACHE;
    case "main-destination":
    default:
      return MAIN_DESTINATION_SPRITE_CACHE;
  }
}

export function forceRender() {
  getPixiMainRenderer().render(getPixiContainer());
}

export async function getSpriteFromCache(area: IArea, whatKind: SpriteType) {
  const { areaKey, name: areaName } = area;
  const cache = getCacheForSpriteType(whatKind);
  if (!cache[areaKey]) {
    const sprite = await GlobalSpriteMap.get(area, whatKind);
    if (sprite) {
      cache[areaKey] = sprite;
    } else {
      // console.error(`No sprite for area '${areaKey || areaName}' in state '${whatKind}'`);
      // throw new Error(`No sprite for area '${areaKey || areaName}' in state '${whatKind}'`);
      console.warn(
        `No sprite for area '${areaKey || areaName}' in state '${whatKind}'`
      );
    }
  }
  return cache[areaKey];
}

export function isSpriteInCache(area: IArea, whatKind: SpriteType) {
  const cache = getCacheForSpriteType(whatKind);
  return !!cache[area.areaKey];
}

export async function updateSpriteForArea(area: IStateAwareArea) {
  const { areaKey } = area;

  // Non-mappable areas have no sprite
  if (!area.isMappable) {
    return;
  }

  // Landmarks have no sprite
  if (area.isLandmark) {
    return;
  }

  // Add any sprites we don't already have
  await Promise.all(addAreaSpritesToContainer(area));

  // Set up sprites for this area:
  // - darken unlit districts
  // - show/hide districts' main destinations and main destination selection glows
  if (area.isDistrict) {
    // Darken unlit districts
    if (AVAILABLE_SPRITE_CACHE[areaKey]?.filters?.length > 0) {
      AVAILABLE_SPRITE_CACHE[areaKey].filters[0].enabled = !area.isLit;
    }

    // Hide main destinations for districts we haven't unlocked
    if (MAIN_DESTINATION_SPRITE_CACHE[areaKey]?.filters?.length > 1) {
      MAIN_DESTINATION_SPRITE_CACHE[areaKey].filters[1].enabled =
        !area.shouldShowMainDestination;
    }

    // Hide main destination selection sprites to start with
    if (MAIN_DESTINATION_SELECTION_SPRITE_CACHE[areaKey]?.filters?.length > 1) {
      MAIN_DESTINATION_SELECTION_SPRITE_CACHE[areaKey].filters[1].enabled =
        true;
    }
  }
}

/**
 * Add all missing sprites for an area to the PIXI container.
 * @param area
 */
function addAreaSpritesToContainer(area: IStateAwareArea): Promise<void>[] {
  const promises = [];
  if (!isSpriteInCache(area, "available")) {
    promises.push(addAreaSpriteToContainer(area, "available"));
  }
  if (!isSpriteInCache(area, "selection")) {
    promises.push(addAreaSpriteToContainer(area, "selection"));
  }
  if (!isSpriteInCache(area, "main-destination")) {
    promises.push(addAreaSpriteToContainer(area, "main-destination"));
  }
  if (!isSpriteInCache(area, "main-destination-selection")) {
    promises.push(addAreaSpriteToContainer(area, "main-destination-selection"));
  }
  return promises;
}
