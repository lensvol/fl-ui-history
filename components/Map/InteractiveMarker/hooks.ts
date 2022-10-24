/* eslint-disable import/prefer-default-export */
import isInteractableAtThisZoomLevel from "features/mapping/isInteractableAtThisZoomLevel";
import { useMemo } from "react";

import { IStateAwareArea, ISetting } from "types/map";

export function useCursor(
  area: IStateAwareArea,
  setting: ISetting | undefined,
  zoomLevel: number
) {
  return useMemo(() => {
    if (!setting?.canTravel) {
      return "grab";
    }
    if (area.isDistrict) {
      return "pointer";
    }
    if (area.isLandmark) {
      return "grab";
    }
    if (
      !area.isLandmark &&
      isInteractableAtThisZoomLevel(area, setting, zoomLevel)
        ? "pointer"
        : "grab"
    ) {
      return "pointer";
    }
    return "grab";
  }, [area, setting, zoomLevel]);
}
