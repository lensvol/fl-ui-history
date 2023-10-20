import createFiltersForSprite from "features/mapping/createFiltersForSprite";
import parseImageName from "features/mapping/parseImageName";
import * as PIXI from "pixi.js";

export default function getFilteredSpriteFromSpritesheet(
  sheet: PIXI.LoaderResource,
  imageName: string
): PIXI.Sprite {
  const { spriteType } = parseImageName(imageName);
  const sprite = new PIXI.Sprite(sheet.textures![imageName]);
  sprite.filters = createFiltersForSprite(spriteType);
  return sprite;
}
