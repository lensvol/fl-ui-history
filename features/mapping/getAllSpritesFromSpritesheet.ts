import * as PIXI from "pixi.js";
import { SpriteRecord } from "types/map";
import getFilteredSpriteFromSpritesheet from "./getFilteredSpriteFromSpritesheet";
import parseImageName from "./parseImageName";

export default function getAllSpritesFromSpritesheet(
  sheet: PIXI.LoaderResource
): SpriteRecord[] {
  const { name, textures } = sheet;

  if (textures === undefined) {
    console.error(`Spritesheet '${name}' has no textures`);
    return [];
  }

  return Object.keys(textures).map((imageName: string) => {
    const { areaKey, spriteType } = parseImageName(imageName);
    const sprite = getFilteredSpriteFromSpritesheet(textures, imageName);
    return [areaKey, spriteType, sprite];
  });
}
