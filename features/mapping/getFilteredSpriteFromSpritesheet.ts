import { ITextureDictionary, Sprite } from "pixi.js";

import createFiltersForSprite from "features/mapping/createFiltersForSprite";
import parseImageName from "features/mapping/parseImageName";

export default function getFilteredSpriteFromSpritesheet(
  textures: ITextureDictionary,
  imageName: string
): Sprite {
  const { spriteType } = parseImageName(imageName);

  const sprite = new Sprite(textures[imageName]);
  sprite.filters = createFiltersForSprite(spriteType);

  return sprite;
}
