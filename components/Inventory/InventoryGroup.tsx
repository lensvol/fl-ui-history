import InventoryItem from "components/Inventory/InventoryItem";
import PossessionsContext from "components/Possessions/PossessionsContext";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import Waypoint from "react-waypoint";

import getVisibleQualities from "selectors/possessions/getVisibleQualities";
import { IQuality } from "types/qualities";
import { IAppState } from "types/app";

export function InventoryGroup(props: Props) {
  const { id, name, onEnter, qualities } = props;

  const handleEnter = useCallback(() => {
    onEnter(id);
  }, [id, onEnter]);

  if (!qualities.length) {
    return null;
  }
  return (
    <Waypoint bottomOffset="70%" onEnter={handleEnter}>
      <div>
        <div className="inventory-group" data-group-name={name}>
          <h2 className="heading heading--2 quality-group__name">{name}</h2>
          <PossessionsContext.Consumer>
            {({ currentlyInStorylet }) => (
              <ul className="items items--inline quality-group__items">
                {qualities.map((quality: IQuality) => (
                  <InventoryItem
                    currentlyInStorylet={currentlyInStorylet}
                    key={quality.id}
                    data={quality}
                  />
                ))}
              </ul>
            )}
          </PossessionsContext.Consumer>
        </div>
      </div>
    </Waypoint>
  );
}

InventoryGroup.displayName = "InventoryGroup";

interface OwnProps {
  filterString: string;
  onEnter: (id: number) => void;
  id: number;
  name: string;
  qualities: number[];
}

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  qualities: getVisibleQualities(state, props),
});

interface Props
  extends Omit<OwnProps, "qualities">,
    ReturnType<typeof mapStateToProps> {}

export default connect(mapStateToProps)(InventoryGroup);
