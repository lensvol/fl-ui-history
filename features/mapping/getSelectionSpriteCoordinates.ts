import { DUMMY_XY_COORDINATES } from "components/Map/constants";
import { IArea } from "types/map";
import { isDistrict } from "features/mapping/index";
import getDestinationSelectionSpriteCoordinates from "features/mapping/getDestinationSelectionSpriteCoordinates";

export default function getSelectionSpriteCoordinates(area: IArea): {
  x: number;
  y: number;
} {
  const { selectionSpriteTopLeftX, selectionSpriteTopLeftY } = area;

  if (
    selectionSpriteTopLeftX === undefined ||
    selectionSpriteTopLeftY === undefined
  ) {
    console.error(`no selection sprite coordinates for (${area.areaKey})`);
    return DUMMY_XY_COORDINATES;
  }

  if (isDistrict(area)) {
    return { x: selectionSpriteTopLeftX, y: selectionSpriteTopLeftY };
  }
  const { x, y } = getDestinationSelectionSpriteCoordinates(area);
  return { x, y };
}
