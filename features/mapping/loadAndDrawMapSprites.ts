import * as SpriteCaching from 'components/Map/ReactLeafletPixiOverlay/sprite-caches';
import { updateSpriteForArea } from 'components/Map/ReactLeafletPixiOverlay/sprite-caches';
import getSortedSpriteRecords from 'features/mapping/getSortedSpriteRecords';

import * as PIXI from 'pixi.js';
import { IArea, IMappableSetting, SpriteType } from 'types/map';
import asStateAwareArea from 'features/mapping/asStateAwareArea';
import drawAreas from 'features/mapping/drawing/drawAreas';
import drawAreaSelections from 'features/mapping/drawing/drawAreaSelections';
import getAllSpritesFromSpritesheet from 'features/mapping/getAllSpritesFromSpritesheet';
import loadSpritesheetsForSetting from 'features/mapping/loadSpritesheetsForSetting';
import { isForegroundSpriteRecord } from 'features/mapping/util';

export default async function loadAndDrawMapSprites(
  _areas: IArea[],
  setting: IMappableSetting,
  onProgress?: (_: any) => void,
) {
  const SPRITE_SHEET_FILE_NAMES = await loadSpritesheetsForSetting(setting, onProgress);
  const loader = PIXI.Loader.shared;
  const areas = _areas;

  let startAt = window.performance.now();
  let duration: number;

  // Get [key, spritetype, sprite] tuples from spritesheet image file names
  const unsortedSpriteRecords: [string, SpriteType, PIXI.Sprite][] =
    SPRITE_SHEET_FILE_NAMES
      .map(filename => getAllSpritesFromSpritesheet(loader.resources[filename]))
      .reduce((acc, next) => [...acc, ...next], []);

  const sortedSpriteRecords = getSortedSpriteRecords(unsortedSpriteRecords, areas);

  // Draw areas
  const drawnAreaPromises = await drawAreas(sortedSpriteRecords, areas);
  await Promise.all(drawnAreaPromises);

  // Add foreground sprites (which need to go underneath selection sprites)
  unsortedSpriteRecords
    .filter(isForegroundSpriteRecord)
    .forEach(([_, aOrB, sprite]) => {
      SpriteCaching.addForegroundStalagmiteSprite(sprite, aOrB as string);
    });

  // Draw selection sprites
  const drawnSelectionPromises = await drawAreaSelections(unsortedSpriteRecords, areas);
  await Promise.all(drawnSelectionPromises);

  areas.forEach(area => updateSpriteForArea(asStateAwareArea(area, areas, setting, undefined)));

  duration = (window.performance.now() - startAt) / 1000;
  console.info(`Adding sprites to container took ${duration.toFixed(2)} s`);

  SpriteCaching.forceRender();
}

