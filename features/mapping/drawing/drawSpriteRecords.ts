import GlobalSpriteMap from 'components/Map/PixiMap/GlobalSpriteMap';
import { isSpriteInCache } from 'components/Map/ReactLeafletPixiOverlay/sprite-caches';
import * as SpriteCaching from 'components/Map/ReactLeafletPixiOverlay/sprite-caches';
import { IArea, SpriteRecord } from 'types/map';

export default function drawSpriteRecords(spriteRecords: SpriteRecord[], areas: IArea[]) {
  return spriteRecords.map(async ([areaKey, spriteType, sprite]) => {
    // Add the sprite to the cache, anyway, even if we don't know about it now
    await GlobalSpriteMap.put(areaKey, spriteType, sprite);

    const area = areas.find(a => a.areaKey === areaKey);
    // We may not have an area for this sprite, but if we do we should add it to the container now
    if (area) {
      // Don't ask to draw again
      if (isSpriteInCache(area, spriteType)) {
        return;
      }
      await SpriteCaching.addAreaSpriteToContainer(area, spriteType);
    }
  });
}

