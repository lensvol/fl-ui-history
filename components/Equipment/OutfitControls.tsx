import React, { useCallback, useMemo, useState } from "react";

import { Props as ReactModalProps } from "react-modal";

import { useDispatch } from "react-redux";

import { changeOutfit } from "actions/outfit";

import ChangeableControls from "components/Equipment/ChangeableControls";
import EquipmentContext from "components/Equipment/EquipmentContext";
import FilterByEnhancementDropDown from "components/Equipment/FilterByEnhancementDropdown";
import LockedOutfitControls from "components/Equipment/LockedOutfitControls";
import SaveOutfitSuccessMessage from "components/Equipment/SaveOutfitSuccessMessage";
import Modal from "components/Modal";
import PurchaseOutfitSlotModal from "components/PurchaseOutfitSlotModal";
import MediaSmUp from "components/Responsive/MediaSmUp";
import SearchField from "components/SearchField";

import {
  MESSAGE_LAPSED_EXCEPTIONAL_OUTFIT,
  OUTFIT_TYPE_EXCEPTIONAL,
} from "constants/outfits";

import { useAppSelector } from "features/app/store";

import useIsMounted from "hooks/useIsMounted";

import getCanUserChangeOutfit from "selectors/possessions/getCanUserChangeOutfit";

import { IOutfit } from "types/outfit";

import getImagePath from "utils/getImagePath";
import wait from "utils/wait";

export default function OutfitControls() {
  const dispatch = useDispatch();

  const avatarImage = useAppSelector(
    (state) => state.myself.character.avatarImage
  );
  const isExceptionalFriend = useAppSelector(
    (state) => state.fate.isExceptionalFriend
  );
  const canChangeOutfit = useAppSelector((state) =>
    getCanUserChangeOutfit(state)
  );
  const outfits = useAppSelector((state) => state.myself.character.outfits);

  const isMounted = useIsMounted();
  const [hasRecentlySaved, setHasRecentlySaved] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isHidingSuccessMessage, setIsHidingSuccessMessage] = useState(false);
  const [isPurchaseOutfitSlotModalOpen, setIsPurchaseOutfitSlotModalOpen] =
    useState(false);
  const [isOutfitChangeErrorModalOpen, setIsOutfitChangeErrorModalOpen] =
    useState(false);
  const [outfitChangeErrorMessage, setOutfitChangeErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [outfitSuccessMessage, setOutfitSuccessMessage] = useState<
    string | undefined
  >(undefined);

  const selectedOutfit: IOutfit | undefined = useMemo(
    () => outfits.find((o) => o.selected),
    [outfits]
  );

  const onSelectOutfit = useCallback(
    async (id: number | "buy-new-outfit") => {
      if (isChanging) {
        return;
      }

      if (id === "buy-new-outfit") {
        setIsPurchaseOutfitSlotModalOpen(true);

        return;
      }

      // Check whether this is an Exceptional outfit
      const newlySelectedOutfit = outfits.find((o) => o.id === id);

      if (newlySelectedOutfit?.type === OUTFIT_TYPE_EXCEPTIONAL) {
        if (!isExceptionalFriend) {
          setOutfitChangeErrorMessage(MESSAGE_LAPSED_EXCEPTIONAL_OUTFIT);
          setIsOutfitChangeErrorModalOpen(true);

          return;
        }
      }

      setIsChanging(true);
      await dispatch(changeOutfit(id));
      setIsChanging(false);
    },
    [dispatch, isChanging, isExceptionalFriend, outfits]
  );

  const onRequestClosePurchaseOutfitModalSlot = useCallback(() => {
    setIsPurchaseOutfitSlotModalOpen(false);
  }, []);

  const handleAfterCloseOutfitChangeErrorModal = useCallback(() => {
    setOutfitChangeErrorMessage(undefined);
  }, []);

  const showSaveOutfitSuccessMessage = useCallback(
    async (message?: string) => {
      setOutfitSuccessMessage(message);
      setHasRecentlySaved(true);
      setIsHidingSuccessMessage(false);

      if (!isMounted.current) {
        return;
      }

      await wait(1000);

      if (!isMounted.current) {
        return;
      }

      setIsHidingSuccessMessage(true);

      await wait(500);

      if (!isMounted.current) {
        return;
      }

      setHasRecentlySaved(false);
    },
    [isMounted]
  );

  const handleRequestCloseOutfitChangeErrorModal = useCallback(() => {
    setIsOutfitChangeErrorModalOpen(false);
  }, []);

  if (selectedOutfit === undefined) {
    return null; // We're broken
  }

  return (
    <>
      <div className="outfit-controls">
        <MediaSmUp>
          <img
            alt=""
            className="outfit-controls__cameo"
            src={getImagePath({
              icon: avatarImage,
              type: "cameo",
            })}
          />
        </MediaSmUp>
        <div className="outfit-controls__dropdown-container">
          <div className="outfit-controls__dropdown-and-buttons">
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flex: "1",
              }}
            >
              <EquipmentContext.Consumer>
                {({ controlIds: { outfitDropdownId } }) => (
                  <label
                    className="heading heading--3 outfit-controls__rubric"
                    htmlFor={outfitDropdownId}
                  >
                    Wear:
                  </label>
                )}
              </EquipmentContext.Consumer>
              {canChangeOutfit ? (
                <ChangeableControls
                  onSaveOutfitSuccess={showSaveOutfitSuccessMessage}
                  onSelectOutfit={onSelectOutfit}
                />
              ) : (
                <LockedOutfitControls selectedOutfit={selectedOutfit} />
              )}
            </div>
            {hasRecentlySaved && (
              <SaveOutfitSuccessMessage
                isHiding={isHidingSuccessMessage}
                message={outfitSuccessMessage}
              />
            )}
          </div>
          <div className="outfit-controls__dropdown-and-buttons">
            <EquipmentContext.Consumer>
              {({ controlIds: { equipmentSearchId } }) => (
                <label
                  className="heading heading--3 outfit-controls__rubric"
                  htmlFor={equipmentSearchId}
                >
                  Find:
                </label>
              )}
            </EquipmentContext.Consumer>
            <EquipmentContext.Consumer>
              {({
                filterString,
                onFilter,
                controlIds: { equipmentSearchId },
              }) => (
                <SearchField
                  className="outfit-controls__search-field"
                  id={equipmentSearchId}
                  onChange={(e) => onFilter(e.target.value)}
                  value={filterString}
                />
              )}
            </EquipmentContext.Consumer>
          </div>
          <div className="outfit-controls__dropdown-and-buttons">
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flex: "1",
              }}
            >
              <span className="heading heading--3 outfit-controls__rubric">
                Show:
              </span>
              <FilterByEnhancementDropDown />
              <span className="heading heading--3">items</span>
            </div>
          </div>
        </div>
      </div>
      <PurchaseOutfitSlotModal
        isOpen={isPurchaseOutfitSlotModalOpen}
        onRequestClose={onRequestClosePurchaseOutfitModalSlot}
      />
      <OutfitChangeErrorModal
        isOpen={isOutfitChangeErrorModalOpen}
        message={outfitChangeErrorMessage}
        onAfterClose={handleAfterCloseOutfitChangeErrorModal}
        onRequestClose={handleRequestCloseOutfitChangeErrorModal}
      />
    </>
  );
}

function OutfitChangeErrorModal(
  props: ReactModalProps & {
    message: string | undefined;
  }
) {
  const { isOpen, message, onAfterClose, onRequestClose } = props;

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={onAfterClose}
      onRequestClose={onRequestClose}
    >
      {message}
    </Modal>
  );
}
