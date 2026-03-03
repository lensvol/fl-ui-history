import { LoaderResource } from "pixi.js";

import getFilteredSpriteFromSpritesheet from "features/mapping/getFilteredSpriteFromSpritesheet";
import parseImageName from "features/mapping/parseImageName";

import { SpriteRecord } from "types/map";

export default function getAllSpritesFromSpritesheet(sheet: LoaderResource) {
  const { name, textures } = sheet;

  if (textures === undefined) {
    console.error(`Spritesheet '${name}' has no textures`);

    return [];
  }

  return Object.keys(textures).map((imageName: string) => {
    const { areaKey, spriteType } = parseImageName(imageName);
    const sprite = getFilteredSpriteFromSpritesheet(textures, imageName);

    return [areaKey, spriteType, sprite] as SpriteRecord;
  });
}
