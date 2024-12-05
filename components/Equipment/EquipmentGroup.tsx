import React, { useMemo } from "react";

import classnames from "classnames";

import AvailableItem from "components/Equipment/AvailableItem";
import EffectItem from "components/Equipment/EffectItem";
import EquipmentContext, {
  EquipmentContextValue,
} from "components/Equipment/EquipmentContext";
import EquipmentSlot from "components/Equipment/EquipmentSlot";
import { useIsChangeable, useIsEffect } from "components/Equipment/hooks";
import LockedSlotIcon from "components/Equipment/LockedSlotIcon";
import PossessionsContext from "components/Possessions/PossessionsContext";

import { useAppSelector } from "features/app/store";

import getAvailableQualitiesForSlot from "selectors/possessions/getAvailableQualitiesForSlot";
import getCanUserChangeOutfit from "selectors/possessions/getCanUserChangeOutfit";
import getQualityBySlotName from "selectors/possessions/getQualityBySlotName";

import { OutfitSlotName } from "types/outfit";

import categoryNameToHumanReadableCategoryName from "utils/categoryNameToHumanReadableCategoryName";
import { normalize } from "utils/stringFunctions";

export default function EquipmentGroup(props: Props) {
  const { name } = props;

  const availableQualities = useAppSelector((state) =>
    getAvailableQualitiesForSlot(state, props)
  );
  const canChangeOutfits = useAppSelector((state) =>
    getCanUserChangeOutfit(state)
  );
  const equippedQuality = useAppSelector((state) =>
    getQualityBySlotName(state, props)
  );
  const isChanging = useAppSelector((state) => state.outfit.isChanging);
  const outfit = useAppSelector((state) => state.outfit);

  const isAvailableItemsEmpty = useMemo(
    () => availableQualities.length <= 0,
    [availableQualities]
  );

  const isChangeable = useIsChangeable(name, outfit);
  const isEffect = useIsEffect(name, outfit);

  const isItemEquippedInThisSlot = useMemo(
    () => outfit.slots[name]?.id !== undefined,
    [name, outfit]
  );

  // If we have no item in this slot and no available items to put in it, then don't show it
  if (isAvailableItemsEmpty && !isItemEquippedInThisSlot) {
    return null;
  }

  return (
    <EquipmentContext.Consumer>
      {({ filterString, openUseOrEquipModal }) => (
        <div className="equipment-group">
          <h2 className="heading heading--2 equipment-group__name">
            {categoryNameToHumanReadableCategoryName(name)}
          </h2>
          {isEffect && (
            <div className="effect-group__items">
              <ul
                className={classnames(
                  "effect-item-list",
                  "effect-item-list-columns-" +
                    Math.min(availableQualities.length, 16)
                )}
              >
                {availableQualities.map((quality) => {
                  if (
                    normalize(quality.name).indexOf(normalize(filterString)) < 0
                  ) {
                    return null;
                  }

                  return (
                    <li className="effect-item-list__item" key={quality.id}>
                      <EffectItem
                        {...quality}
                        key={quality.id}
                        openUseOrEquipModal={openUseOrEquipModal}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {!isEffect && (
            <div className="equipment-group__slot-and-available-items">
              <div
                className={classnames(
                  "equipment-group__equipment-slot-container",
                  equippedQuality === undefined
                    ? "equipment-group__equipment-slot-container--empty"
                    : "equipment-group__equipment-slot-container--full",
                  !canChangeOutfits &&
                    "equipment-group__equipment-slot-container--locked",
                  !isChangeable &&
                    "equipment-group__equipment-slot-container--unchangeable"
                )}
              >
                <EquipmentSlot name={name} />
                {isChangeable && !canChangeOutfits && <LockedSlotIcon />}
              </div>
              <ul
                className={classnames(
                  "available-item-list",
                  isChanging && "available-item-list--is-changing"
                )}
              >
                {availableQualities.map((quality) => {
                  if (
                    normalize(quality.name).indexOf(normalize(filterString)) < 0
                  ) {
                    return null;
                  }

                  return (
                    <li className="available-item-list__item" key={quality.id}>
                      <PossessionsContext.Consumer>
                        {({ currentlyInStorylet }) => (
                          <AvailableItem
                            {...quality}
                            key={quality.id}
                            currentlyInStorylet={currentlyInStorylet}
                            openUseOrEquipModal={openUseOrEquipModal}
                          />
                        )}
                      </PossessionsContext.Consumer>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </EquipmentContext.Consumer>
  );
}

EquipmentGroup.displayName = "EquippedGroup";

type OwnProps = {
  name: OutfitSlotName;
};

type Props = Pick<EquipmentContextValue, "filterString"> & OwnProps;
