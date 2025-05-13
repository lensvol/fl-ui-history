import React, { useCallback, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import { withRouter, RouteComponentProps } from "react-router-dom";

import { equipQuality, renameOutfit, unequipQuality } from "actions/outfit";
import { useQuality as _useQuality } from "actions/storylet";

import EquipmentContext from "components/Equipment/EquipmentContext";
import EquipmentGroup from "components/Equipment/EquipmentGroup";
import OutfitControls from "components/Equipment/OutfitControls";
import PossessionsContext from "components/Possessions/PossessionsContext";
import RenameOutfitModal from "components/Possessions/RenameOutfitModal";
import UseOrEquipModal from "components/Possessions/UseOrEquipModal";

import { useAppSelector } from "features/app/store";

import findSelectedOutfit from "selectors/outfits/findSelectedOutfit";

import { Success } from "services/BaseMonadicService";

import { OutfitSlotName } from "types/outfit";
import { IQuality } from "types/qualities";

function Equipment({ history }: Props) {
  const outfit = useAppSelector((state) => findSelectedOutfit(state));
  const outfitState = useAppSelector((state) => state.outfit);

  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [filterString, setFilterString] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isUseOrEquipModalOpen, setIsUseOrEquipModalOpen] = useState(false);
  const [qualityBeingUsedOrEquipped, setQualityBeingUsedOrEquipped] = useState<
    | {
        quality: Pick<IQuality, "name" | "image" | "id">;
        equipped: boolean;
      }
    | undefined
  >();

  const groups = useMemo(() => {
    return Object.keys(outfitState.slots)
      .map((name) => name as OutfitSlotName)
      .map((name) => ({ name }));
  }, [outfitState]);

  const handleEquipQuality = useCallback(() => {
    setIsUseOrEquipModalOpen(false);

    if (qualityBeingUsedOrEquipped) {
      const {
        equipped,
        quality: { id },
      } = qualityBeingUsedOrEquipped;

      if (equipped) {
        dispatch(unequipQuality(id));
      } else {
        dispatch(equipQuality(id, true));
      }
    }
  }, [dispatch, qualityBeingUsedOrEquipped]);

  const handleFilter = useCallback((newFilterString: string) => {
    setFilterString(newFilterString);
  }, []);

  const handleUseQuality = useCallback(() => {
    setIsUseOrEquipModalOpen(false);

    if (qualityBeingUsedOrEquipped) {
      dispatch(_useQuality(qualityBeingUsedOrEquipped.quality.id, history));
    }
  }, [dispatch, history, qualityBeingUsedOrEquipped]);

  const handleRequestCloseUseOrEquipModal = useCallback(() => {
    setIsUseOrEquipModalOpen(false);
    setQualityBeingUsedOrEquipped(undefined);
  }, []);

  const openUseOrEquipModal = useCallback(
    (
      quality: { id: number; name: string; image: string },
      equipped: boolean
    ) => {
      setIsUseOrEquipModalOpen(true);
      setQualityBeingUsedOrEquipped({ quality, equipped });
    },
    []
  );

  const onSubmit = useCallback(
    async ({ name }: { name: string }) => {
      setErrorMessage(undefined);

      if (!outfit) {
        return;
      }

      try {
        const result = await renameOutfit(outfit.id, name)(dispatch);

        if (result instanceof Success) {
          setIsRenameModalOpen(false);

          return;
        }

        setErrorMessage(result.message);
      } catch (e) {
        // Possibly a bad request
        console.error(e);
      }
    },
    [dispatch, outfit]
  );

  return (
    <PossessionsContext.Consumer>
      {({ currentlyInStorylet }) => (
        <EquipmentContext.Provider
          value={{
            filterString,
            openUseOrEquipModal,
            onFilter: handleFilter,
            controlIds: {
              equipmentSearchId: "a11y-equipment-search",
              outfitDropdownId: "a11y-outfit-dropdown",
            },
          }}
        >
          <OutfitControls />
          <ul className="equipment-group-list">
            {groups.map(({ name }: { name: OutfitSlotName }) => (
              <li className="equipment-group-list__item" key={name}>
                <EquipmentGroup
                  filterString={filterString}
                  key={name}
                  name={name}
                />
              </li>
            ))}
          </ul>
          <RenameOutfitModal
            errorMessage={errorMessage}
            isOpen={isRenameModalOpen}
            onRequestClose={() => setIsRenameModalOpen(false)}
            onSubmit={onSubmit}
          />
          {qualityBeingUsedOrEquipped && (
            <UseOrEquipModal
              currentlyInStorylet={currentlyInStorylet}
              isOpen={isUseOrEquipModalOpen}
              onEquip={handleEquipQuality}
              onUse={handleUseQuality}
              onRequestClose={handleRequestCloseUseOrEquipModal}
              quality={qualityBeingUsedOrEquipped.quality}
              equipped={qualityBeingUsedOrEquipped.equipped}
            />
          )}
        </EquipmentContext.Provider>
      )}
    </PossessionsContext.Consumer>
  );
}

Equipment.displayName = "Equipment";

type Props = RouteComponentProps;

export default withRouter(Equipment);
