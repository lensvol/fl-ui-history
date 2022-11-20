import { IArea } from "types/map";
import { DUMMY_XY_COORDINATES } from "./constants";
import { isDistrict } from "./index";

export default function getDestinationSelectionSpriteCoordinates(area: IArea): {
  x: number;
  y: number;
} {
  if (isDistrict(area)) {
    throw new Error(
      "Tried to retrieve Destination selection sprite coords for a District"
    );
  }
  const { areaKey, selectionSpriteTopLeftX, selectionSpriteTopLeftY } = area;

  if (
    selectionSpriteTopLeftX !== undefined &&
    selectionSpriteTopLeftY !== undefined
  ) {
    return {
      x: selectionSpriteTopLeftX,
      y: selectionSpriteTopLeftY,
    };
  }

  console.error(
    `getDestinationSpriteSelectionCoordinates({${areaKey}): this area has no selection sprite coords`
  );
  return DUMMY_XY_COORDINATES;
}
