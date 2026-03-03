import { Loader } from "pixi.js";

import {
  addForegroundStalagmiteSprite,
  forceRender,
  updateSpriteForArea,
} from "components/Map/ReactLeafletPixiOverlay/sprite-caches";

import asStateAwareArea from "features/mapping/asStateAwareArea";
import drawAreas from "features/mapping/drawing/drawAreas";
import drawAreaSelections from "features/mapping/drawing/drawAreaSelections";
import getAllSpritesFromSpritesheet from "features/mapping/getAllSpritesFromSpritesheet";
import getSortedSpriteRecords from "features/mapping/getSortedSpriteRecords";
import loadSpritesheetsForSetting from "features/mapping/loadSpritesheetsForSetting";
import { isForegroundSpriteRecord } from "features/mapping/util";

import { IArea, IMappableSetting } from "types/map";

export default async function loadAndDrawMapSprites(
  _areas: IArea[],
  setting: IMappableSetting,
  onProgress?: (_: any) => void
) {
  const loader = Loader.shared;
  const SPRITE_SHEET_FILE_NAMES = await loadSpritesheetsForSetting(
    loader,
    setting,
    onProgress
  );
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
  await drawAreas(sortedSpriteRecords, areas);

  // Add foreground sprites (which need to go underneath selection sprites)
  unsortedSpriteRecords
    .filter(isForegroundSpriteRecord)
    .forEach(([_, aOrB, sprite]) => {
      addForegroundStalagmiteSprite(sprite, aOrB as string);
    });

  // Draw selection sprites
  await drawAreaSelections(unsortedSpriteRecords, areas);

  areas.forEach((area) =>
    updateSpriteForArea(asStateAwareArea(area, areas, setting, undefined))
  );

  const duration = (window.performance.now() - startAt) / 1000;
  console.info(`Adding sprites to container took ${duration.toFixed(2)} s`); // eslint-disable-line no-console

  forceRender();
}
