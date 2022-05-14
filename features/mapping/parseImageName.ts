import { SPRITE_REGEX } from 'features/mapping/constants';
import { SpriteType } from 'types/map';

export default function parseImageName(imageName: string) {
  // Extract the area key and sprite type from the original image name
  const match = SPRITE_REGEX.exec(imageName)!; // Fail noisily if we have bad keys
  try {
    const areaKey = match[1];
    // '*-selected' denotes selection sprites
    const spriteType = match[2].replace('selected', 'selection') as SpriteType;
    return { areaKey, spriteType };
  } catch (e) {
    console.error(`Woo, caught a warning while parsing ${imageName}`);
    throw e;
  }
}
