import React, { useMemo } from "react";
import { IArea } from "types/map";
import { isLandmark } from "features/mapping";

type Props = {
  area: IArea;
  onClick: (area: IArea) => Promise<void>;
};

export default function PossibleMapMenuItem({ area, onClick }: Props) {
  const shouldAreaAppearInList = useMemo(() => {
    // If we have no ID, we can't do anything with this area as a menu item, so don't show it
    // (API response issue)
    if (!area.id) {
      return false;
    }

    // This is a Landmark, which is never available for travel, so we should exclude it
    if (isLandmark(area)) {
      return false;
    }

    // If the area is unlocked for travel, or has a gate event we can use to gain access,
    // then we should show it
    if (area.unlocked || area.gateEvent !== undefined) {
      return true;
    }

    // Otherwise we don't know what to do with it, and shouldn't display it
    return false;
  }, [area]);

  if (!shouldAreaAppearInList) {
    return null;
  }

  return (
    <li key={area.areaKey}>
      <button onClick={() => onClick(area)} type="button">
        {area.name}
      </button>
    </li>
  );
}
