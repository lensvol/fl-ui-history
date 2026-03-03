import { Point } from "pixi.js";

import { DUMMY_XY_COORDINATES } from "features/mapping/constants";
import getMainDestinationSelectionCoordinates from "features/mapping/getMainDestinationSelectionCoordinates";
import getSelectionSpriteCoordinates from "features/mapping/getSelectionSpriteCoordinates";

import { IArea, SpriteType } from "types/map";

function pointFromXY({ x, y }: { x: number; y: number }) {
  return new Point(x / 2, -y / 2);
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

      return new Point(spriteTopLeftX / 2, -spriteTopLeftY / 2);
    }

    case "selection": {
      return pointFromXY(getSelectionSpriteCoordinates(area));
    }

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

      return new Point(
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
