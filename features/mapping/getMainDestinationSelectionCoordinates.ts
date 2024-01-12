import { IArea } from "types/map";
import { isDistrict } from "features/mapping/index";
import { DUMMY_XY_COORDINATES } from "./constants";

export default function getMainDestinationSelectionCoordinates(area: IArea): {
  x: number;
  y: number;
} {
  // only Districts have main destination selection sprites
  if (!isDistrict(area)) {
    throw new Error(
      `Attempted to fetch main-destination-selection sprite for non-district area ${area.name || area.areaKey}`
    );
  }

  const {
    mainDestinationSelectionSpriteTopLeftX,
    mainDestinationSelectionSpriteTopLeftY,
  } = area;

  if (
    mainDestinationSelectionSpriteTopLeftX === undefined ||
    mainDestinationSelectionSpriteTopLeftY === undefined
  ) {
    console.error(
      `getMainDestinationSelectionCoordinates(${area.areaKey}): no main dest selection sprites; dumping area`
    );
    console.error(area);
    return DUMMY_XY_COORDINATES;
  }
  return {
    x: mainDestinationSelectionSpriteTopLeftX,
    y: mainDestinationSelectionSpriteTopLeftY,
  };
}
