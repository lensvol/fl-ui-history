/* eslint-disable import/prefer-default-export */
import { useMemo } from "react";

import isInteractableAtThisZoomLevel from "features/mapping/isInteractableAtThisZoomLevel";

import { ISetting, IStateAwareArea } from "types/map";

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
    ) {
      return "pointer";
    }

    return "grab";
  }, [area, setting, zoomLevel]);
}
