import React from "react";

import EmptySlot from "components/Equipment/EmptySlot";
import EquipmentContext from "components/Equipment/EquipmentContext";
import EquippedItem from "components/Equipment/EquippedItem";
import Loading from "components/Loading";
import PossessionsContext from "components/Possessions/PossessionsContext";

import { useAppSelector } from "features/app/store";

import getQualityBySlotName from "selectors/possessions/getQualityBySlotName";

import { OutfitSlotName } from "types/outfit";

export default function EquipmentSlot(props: Props) {
  const isChanging = useAppSelector((state) => state.outfit.isChanging);
  const quality = useAppSelector((state) => getQualityBySlotName(state, props));

  // If we're in mid-change, just display a loading icon
  if (isChanging) {
    return (
      <div className="equipment-slot--is-changing">
        <Loading spinner small />
      </div>
    );
  }

  if (!quality) {
    return <EmptySlot isChanging={isChanging} name={props.name} />;
  }

  return (
    <PossessionsContext.Consumer>
      {({ currentlyInStorylet }) => (
        <EquipmentContext.Consumer>
          {({ filterString, openUseOrEquipModal }) => (
            <EquippedItem
              {...quality}
              category={quality.category as OutfitSlotName}
              currentlyInStorylet={currentlyInStorylet}
              filterString={filterString}
              openUseOrEquipModal={openUseOrEquipModal}
            />
          )}
        </EquipmentContext.Consumer>
      )}
    </PossessionsContext.Consumer>
  );
}

EquipmentSlot.displayName = "EquipmentSlot";

type Props = {
  name: OutfitSlotName;
};
