import { Sprite } from "pixi.js";

import { IArea, SpriteType } from "types/map";

const coastlineMap: { [key: string]: Sprite } = {};
const spriteMap: { [key: string]: Sprite } = {};
const selectionSpriteMap: { [key: string]: Sprite } = {};
const mainDestinationMap: { [key: string]: Sprite } = {};
const mainDestinationSelectionMap: { [key: string]: Sprite } = {};
const fogMap: { [key: string]: Sprite } = {};
const seaMap: { [key: string]: Sprite } = {};
const coastlineSeaMap: { [key: string]: Sprite } = {};

const mapsByType: { [key in SpriteType]: { [key: string]: Sprite } } = {
  /* eslint-disable quote-props */
  available: spriteMap,
  coastline: coastlineMap,
  coastlinesea: coastlineSeaMap,
  fog: fogMap,
  "main-destination": mainDestinationMap,
  "main-destination-selection": mainDestinationSelectionMap,
  sea: seaMap,
  selection: selectionSpriteMap,
  /* eslint-enable quote-props */
};

const GlobalSpriteMap = {
  put: async (areaKey: string, whatKind: SpriteType, sprite: Sprite) => {
    // Scale the sprite (not sure why it's necessary)
    sprite.scale.set(0.5, 0.5);

    // Add it to the cache
    mapsByType[whatKind][areaKey] = sprite;
  },

  get: async (area: IArea, whatKind: SpriteType) => {
    const { areaKey: key } = area;

    const mapToUse = mapsByType[whatKind];

    if (mapToUse[key]) {
      return mapToUse[key];
    }

    return undefined;
  },
};

export default GlobalSpriteMap;
