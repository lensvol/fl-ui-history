import * as PIXI from 'pixi.js';
import { IArea, SpriteType } from 'types/map';

const coastlineMap: { [key: string]: PIXI.Sprite } = {};
const spriteMap: { [key: string]: PIXI.Sprite } = {};
const selectionSpriteMap: { [key: string]: PIXI.Sprite } = {};
const mainDestinationMap: { [key: string]: PIXI.Sprite } = {};
const mainDestinationSelectionMap: { [key: string]: PIXI.Sprite } = {};
const fogMap: { [key: string]: PIXI.Sprite } = {};
const seaMap: { [key: string]: PIXI.Sprite } = {};
const coastlineSeaMap: { [key: string]: PIXI.Sprite } = {};

const mapsByType: { [key in SpriteType]: { [key: string]: PIXI.Sprite } } = {
  'available': spriteMap,
  'selection': selectionSpriteMap,
  'main-destination': mainDestinationMap,
  'main-destination-selection': mainDestinationSelectionMap,
  'coastline': coastlineMap,
  'fog': fogMap,
  'sea': seaMap,
  'coastlinesea': coastlineSeaMap,
};

const GlobalSpriteMap = {
  put: async (areaKey: string, whatKind: SpriteType, sprite: PIXI.Sprite) => {
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
  }
};

export default GlobalSpriteMap;

