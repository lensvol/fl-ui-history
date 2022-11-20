import * as PIXI from "pixi.js";
import createFiltersForSprite from "./createFiltersForSprite";
import parseImageName from "./parseImageName";

export default function getFilteredSpriteFromSpritesheet(
  textures: PIXI.ITextureDictionary,
  imageName: string
): PIXI.Sprite {
  const { spriteType } = parseImageName(imageName);
  const sprite = new PIXI.Sprite(textures[imageName]);
  sprite.filters = createFiltersForSprite(spriteType);
  return sprite;
}
