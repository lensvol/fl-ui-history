import * as PIXI from "pixi.js";
import { IArea, IMappableSetting } from "types/map";

import * as SpriteCaching from "components/Map/ReactLeafletPixiOverlay/sprite-caches";
import { updateSpriteForArea } from "components/Map/ReactLeafletPixiOverlay/sprite-caches";
import asStateAwareArea from "./asStateAwareArea";
import drawAreas from "./drawing/drawAreas";
import drawAreaSelections from "./drawing/drawAreaSelections";
import getAllSpritesFromSpritesheet from "./getAllSpritesFromSpritesheet";
import getSortedSpriteRecords from "./getSortedSpriteRecords";
import loadSpritesheetsForSetting from "./loadSpritesheetsForSetting";
import { isForegroundSpriteRecord } from "./util";

export default async function loadAndDrawMapSprites(
  _areas: IArea[],
  setting: IMappableSetting,
  onProgress?: (_: any) => void
) {
  const SPRITE_SHEET_FILE_NAMES = await loadSpritesheetsForSetting(
    setting,
    onProgress
  );
  const loader = PIXI.Loader.shared;
  const areas = _areas;

  const startAt = window.performance.now();

  // Get [key, spritetype, sprite] tuples from spritesheet image file names
  const unsortedSpriteRecords = SPRITE_SHEET_FILE_NAMES.map((filename) =>
    getAllSpritesFromSpritesheet(loader.resources[filename])
  ).reduce((acc, next) => [...acc, ...next], []);

  const sortedSpriteRecords = getSortedSpriteRecords(
    unsortedSpriteRecords,
    areas
  );

  // Draw areas
  // const drawnAreaPromises = await drawAreas(sortedSpriteRecords, areas);
  await drawAreas(sortedSpriteRecords, areas);
  // await Promise.all(drawnAreaPromises);

  // Add foreground sprites (which need to go underneath selection sprites)
  unsortedSpriteRecords
    .filter(isForegroundSpriteRecord)
    .forEach(([_, aOrB, sprite]) => {
      SpriteCaching.addForegroundStalagmiteSprite(sprite, aOrB as string);
    });

  // Draw selection sprites
  await drawAreaSelections(unsortedSpriteRecords, areas);

  areas.forEach((area) =>
    updateSpriteForArea(asStateAwareArea(area, areas, setting, undefined))
  );

  const duration = (window.performance.now() - startAt) / 1000;
  console.info(`Adding sprites to container took ${duration.toFixed(2)} s`); // eslint-disable-line no-console

  SpriteCaching.forceRender();
}
