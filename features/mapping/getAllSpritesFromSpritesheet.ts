import * as PIXI from "pixi.js";
import { SpriteType } from 'types/map';
import getFilteredSpriteFromSpritesheet from 'features/mapping/getFilteredSpriteFromSpritesheet';
import parseImageName from 'features/mapping/parseImageName';

export default function getAllSpritesFromSpritesheet(sheet: PIXI.LoaderResource): [string, SpriteType, PIXI.Sprite][] {
  return Object.keys(sheet.textures!).map((imageName: string) => [
    parseImageName(imageName).areaKey,
    parseImageName(imageName).spriteType,
    getFilteredSpriteFromSpritesheet(sheet, imageName),
  ]);
}
