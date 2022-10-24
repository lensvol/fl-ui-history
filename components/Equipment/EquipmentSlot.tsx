import React from "react";
import { connect } from "react-redux";

import getQualityBySlotName from "selectors/possessions/getQualityBySlotName";
import { IAppState } from "types/app";
import Loading from "components/Loading";
import { OutfitSlotName } from "types/outfit";

import EquippedItem from "components/Equipment/EquippedItem";
import EmptySlot from "components/Equipment/EmptySlot";
import PossessionsContext from "components/Possessions/PossessionsContext";
import { Feature } from "flagged";
import {
  FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS,
  NEW_OUTFIT_BEHAVIOUR,
} from "features/feature-flags";
import EquipmentContext from "./EquipmentContext";

function EquipmentSlot(props: Props) {
  const { isChanging, quality } = props;

  // If we're in mid-change, just display a loading icon
  if (isChanging) {
    return (
      <div className="equipment-slot--is-changing">
        <Loading spinner small />
      </div>
    );
  }

  if (quality !== undefined) {
    return (
      <PossessionsContext.Consumer>
        {({ currentlyInStorylet }) => (
          <EquipmentContext.Consumer>
            {({ filterString, openUseOrEquipModal }) => (
              <Feature name={NEW_OUTFIT_BEHAVIOUR}>
                {(isEnabled: boolean) => (
                  <Feature name={FEATURE_DOES_STORYLET_STATE_LOCK_OUTFITS}>
                    {(doesStoryletStateLockOutfits: boolean) => (
                      <EquippedItem
                        {...quality!}
                        areOutfitsLockable={isEnabled}
                        category={quality!.category as OutfitSlotName}
                        currentlyInStorylet={currentlyInStorylet}
                        doesStoryletStateLockOutfits={
                          doesStoryletStateLockOutfits
                        }
                        filterString={filterString}
                        openUseOrEquipModal={openUseOrEquipModal}
                      />
                    )}
                  </Feature>
                )}
              </Feature>
            )}
          </EquipmentContext.Consumer>
        )}
      </PossessionsContext.Consumer>
    );
  }

  return <EmptySlot isChanging={isChanging} />;
}

EquipmentSlot.displayName = "EquipmentSlot";

type OwnProps = { name: OutfitSlotName };

const mapStateToProps = (state: IAppState, props: OwnProps) => ({
  isChanging: state.outfit.isChanging,
  quality: getQualityBySlotName(state, props),
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

export default connect(mapStateToProps)(EquipmentSlot);
