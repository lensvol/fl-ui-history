import React, { useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import { IAppState } from "types/app";
import { IArea } from "types/map";
import { begin } from "actions/storylet";
import { changeLocation } from "actions/map";
import PossibleMapMenuItem from "components/AccessibleSidebar/PossibleMapMenuItem";

export function AccessibleMapMenu({
  areas,
  currentArea,
  isMoving,
  setting,
}: Props) {
  const dispatch = useDispatch();

  const handleClick = useCallback(
    async (area: IArea) => {
      const { gateEvent, unlocked, id: areaId } = area;

      // We are here
      if (areaId === currentArea?.id) {
        return;
      }

      // We are moving areas
      if (isMoving) {
        return;
      }

      // We can move to this area directly
      if (unlocked) {
        await dispatch(changeLocation(areaId));
      }

      if (gateEvent) {
        await dispatch(begin(gateEvent.id));
      }
    },
    [currentArea, dispatch, isMoving]
  );

  if (!setting?.canOpenMap) {
    return <div>Travel is currently unavailable.</div>;
  }

  return (
    <ul className="accessible-map-menu">
      {(areas || [])
        .filter((area) => !area.isLandmark) // Exclude flavour-only areas
        .map((area) => (
          <PossibleMapMenuItem
            key={area.areaKey}
            area={area}
            onClick={handleClick}
          />
        ))}
    </ul>
  );
}

AccessibleMapMenu.displayName = "AccessibleMapMenu";

const mapStateToProps = (state: IAppState) => {
  const {
    map: { areas, currentArea, isMoving, setting },
  } = state;
  return {
    areas,
    currentArea,
    isMoving,
    setting,
  };
};

type Props = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(AccessibleMapMenu);
