import { IArea, SpriteType } from "types/map";
import * as PIXI from "pixi.js";
import getSelectionSpriteCoordinates from "./getSelectionSpriteCoordinates";
import getMainDestinationSelectionCoordinates from "./getMainDestinationSelectionCoordinates";
import { DUMMY_XY_COORDINATES } from "./constants";

function pointFromXY({ x, y }: { x: number; y: number }) {
  return new PIXI.Point(x / 2, -y / 2);
}

export default function getPositionForSprite(
  area: IArea,
  whatKind: SpriteType
) {
  const {
    areaKey,
    mainDestinationSpriteTopLeftX,
    mainDestinationSpriteTopLeftY,
    spriteTopLeftX,
    spriteTopLeftY,
  } = area;

  switch (whatKind) {
    case "available": {
      if (spriteTopLeftX === undefined || spriteTopLeftY === undefined) {
        console.error(
          `getPositionForSprite(${areaKey}): this area has no sprite coords`
        );
        console.error(area);
        return pointFromXY(DUMMY_XY_COORDINATES);
      }
      return new PIXI.Point(spriteTopLeftX / 2, -spriteTopLeftY / 2);
    }
    case "selection":
      return pointFromXY(getSelectionSpriteCoordinates(area));
    case "main-destination-selection": {
      return pointFromXY(getMainDestinationSelectionCoordinates(area));
    }
    case "main-destination": {
      if (
        mainDestinationSpriteTopLeftX === undefined ||
        mainDestinationSpriteTopLeftY === undefined
      ) {
        console.error(
          `getPositionForSprite(${areaKey}): no main destination sprite coordinates`
        );
        return pointFromXY(DUMMY_XY_COORDINATES);
      }
      return new PIXI.Point(
        mainDestinationSpriteTopLeftX / 2,
        -mainDestinationSpriteTopLeftY / 2
      );
    }
    default:
      console.error(
        `I don't know what to do with this sprite: ${areaKey}-${whatKind}`
      );
      return pointFromXY(DUMMY_XY_COORDINATES);
  }
}
