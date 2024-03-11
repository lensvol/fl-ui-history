import {
  FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS,
  NEW_OUTFIT_BEHAVIOUR,
} from "features/feature-flags";
import React, { useMemo } from "react";
import { useIsChangeable, useIsEffect } from "components/Equipment/hooks";
import LockedSlotIcon from "components/Equipment/LockedSlotIcon";
import { connect } from "react-redux";
import classnames from "classnames";
import getCanUserChangeOutfit from "selectors/possessions/getCanUserChangeOutfit";
import { OutfitSlotName } from "types/outfit";
import AvailableItem from "components/Equipment/AvailableItem";
import EffectItem from "components/Equipment/EffectItem";
import EquipmentSlot from "components/Equipment/EquipmentSlot";
import PossessionsContext from "components/Possessions/PossessionsContext";

import getQualityBySlotName from "selectors/possessions/getQualityBySlotName";
import getAvailableQualitiesForSlot from "selectors/possessions/getAvailableQualitiesForSlot";
import categoryNameToHumanReadableCategoryName from "utils/categoryNameToHumanReadableCategoryName";

import { IAppState } from "types/app";
import { Feature } from "flagged";
import { normalize } from "utils/stringFunctions";
import EquipmentContext, { EquipmentContextValue } from "./EquipmentContext";

function EquipmentGroup(props: Props) {
  const {
    availableQualities,
    canChangeOutfits,
    equippedQuality,
    isChanging,
    name,
    outfit,
  } = props;

  const isAvailableItemsEmpty = useMemo(
    () => availableQualities.length <= 0,
    [availableQualities.length]
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
                          <Feature name={NEW_OUTFIT_BEHAVIOUR}>
                            {(areOutfitsLockable: boolean) => (
                              <Feature
                                name={FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS}
                              >
                                {(doesStoryletStateLockOutfits: boolean) => (
                                  <AvailableItem
                                    {...quality}
                                    key={quality.id}
                                    areOutfitsLockable={areOutfitsLockable}
                                    doesStoryletStateLockOutfits={
                                      doesStoryletStateLockOutfits
                                    }
                                    currentlyInStorylet={currentlyInStorylet}
                                    openUseOrEquipModal={openUseOrEquipModal}
                                  />
                                )}
                              </Feature>
                            )}
                          </Feature>
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
  areOutfitsLockable: boolean;
  doesStoryletStateLockOutfits: boolean;
  name: OutfitSlotName;
};

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  availableQualities: getAvailableQualitiesForSlot(state, props),
  canChangeOutfits: getCanUserChangeOutfit(state, props),
  equippedQuality: getQualityBySlotName(state, props),
  isChanging: state.outfit.isChanging,
  outfit: state.outfit,
});

type Props = Pick<EquipmentContextValue, "filterString"> &
  OwnProps &
  ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(EquipmentGroup);
