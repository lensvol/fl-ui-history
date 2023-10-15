import { purchaseItem } from "actions/fate";

import { fetchMyself } from "actions/myself";
import Loading from "components/Loading";
import Modal from "components/Modal";
import { OUTFIT_PURCHASE } from "constants/fate";
import React, { useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import getOrderedOutfits from "selectors/outfit/getOrderedOutfits";
import { Success } from "services/BaseMonadicService";
import { IAppState } from "types/app";
import { POSSIBLE_DEFAULT_NAMES, PurchaseOutfitStep } from "./constants";
import PurchaseOutfitFailure from "./PurchaseOutfitFailure";
import PurchaseOutfitReady from "./PurchaseOutfitReady";
import PurchaseOutfitSuccess from "./PurchaseOutfitSuccess";

export function PurchaseOutfitSlotModal({
  dispatch,
  fateCards,
  isOpen,
  onRequestClose,
  outfits,
}: Props) {
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

    const storeItemId = fateCards.find((fc) => fc.action === OUTFIT_PURCHASE)
      ?.id;

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

const mapStateToProps = (state: IAppState) => ({
  fateCards: state.fate.data.fateCards,
  outfits: getOrderedOutfits(state),
});

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: ThunkDispatch<any, any, any>;
  isOpen: boolean;
  onRequestClose: () => void;
};

export default connect(mapStateToProps)(PurchaseOutfitSlotModal);
