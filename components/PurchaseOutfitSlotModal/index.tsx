import React, { useCallback, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import { purchaseItem } from "actions/fate";
import { fetchMyself } from "actions/myself";

import Loading from "components/Loading";
import Modal from "components/Modal";
import {
  POSSIBLE_DEFAULT_NAMES,
  PurchaseOutfitStep,
} from "components/PurchaseOutfitSlotModal/constants";
import PurchaseOutfitFailure from "components/PurchaseOutfitSlotModal/PurchaseOutfitFailure";
import PurchaseOutfitReady from "components/PurchaseOutfitSlotModal/PurchaseOutfitReady";
import PurchaseOutfitSuccess from "components/PurchaseOutfitSlotModal/PurchaseOutfitSuccess";

import { OUTFIT_PURCHASE } from "constants/fate";

import { useAppSelector } from "features/app/store";

import getOrderedOutfits from "selectors/outfits/getOrderedOutfits";

import { Success } from "services/BaseMonadicService";

export default function PurchaseOutfitSlotModal({
  isOpen,
  onRequestClose,
}: Props) {
  const fateCards = useAppSelector((state) => state.fate.data.fateCards);
  const outfits = useAppSelector((state) => getOrderedOutfits(state));

  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(PurchaseOutfitStep.Ready);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [newOutfitName, setNewOutfitName] = useState<string | undefined>();

  const onBuyOutfit = useCallback(async () => {
    // Spin
    setCurrentStep(PurchaseOutfitStep.Loading);

    // Get a random name that isn't already one of the player's outfit names
    const outfitNames = outfits.map((o) => o.name);
    let defaultName = outfitNames[0];

    while (outfitNames.indexOf(defaultName) >= 0) {
      defaultName =
        POSSIBLE_DEFAULT_NAMES[
          Math.floor(Math.random() * POSSIBLE_DEFAULT_NAMES.length)
        ];
    }

    const storeItemId = fateCards.find(
      (fc) => fc.action === OUTFIT_PURCHASE
    )?.id;

    if (!storeItemId) {
      setErrorMessage(
        "We couldn't find the corresponding Fate item for outfit purchase. No Fate has been deducted."
      );
      setCurrentStep(PurchaseOutfitStep.Failure);

      return;
    }

    // Purchase the item
    const result = await purchaseItem({
      newName: defaultName,
      storeItemId,
    })(dispatch);

    // Yay!
    if (result instanceof Success) {
      // Fetch updated myself info
      await dispatch(fetchMyself());

      setNewOutfitName(defaultName);
      setCurrentStep(PurchaseOutfitStep.Success);

      return;
    }

    // Handle a server-side failure
    setCurrentStep(PurchaseOutfitStep.Failure);
    setErrorMessage(result.message);
  }, [dispatch, fateCards, outfits]);

  const onReset = useCallback(() => {
    setNewOutfitName(undefined);
    setErrorMessage(undefined);
    setCurrentStep(PurchaseOutfitStep.Ready);
  }, []);

  const onAfterClose = useCallback(() => {
    onReset();
  }, [onReset]);

  const contents = useMemo(() => {
    switch (currentStep) {
      case PurchaseOutfitStep.Loading:
        return <Loading spinner />;

      case PurchaseOutfitStep.Success:
        return (
          <PurchaseOutfitSuccess
            initialName={newOutfitName!}
            onFinishedRenaming={onRequestClose}
          />
        );

      case PurchaseOutfitStep.Failure:
        return (
          <PurchaseOutfitFailure message={errorMessage} onReset={onReset} />
        );

      default:
        return <PurchaseOutfitReady onBuyOutfit={onBuyOutfit} />;
    }
  }, [
    currentStep,
    errorMessage,
    newOutfitName,
    onBuyOutfit,
    onRequestClose,
    onReset,
  ]);

  return (
    <Modal
      className="purchase-outfit-slot-modal__content"
      isOpen={isOpen}
      onAfterClose={onAfterClose}
      onRequestClose={onRequestClose}
    >
      {contents}
    </Modal>
  );
}

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
};
