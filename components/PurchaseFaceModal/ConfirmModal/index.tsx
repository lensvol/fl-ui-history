import React, { useCallback, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import { fetchActions } from "actions/actions";
import { fetch as fetchFate, purchaseItem } from "actions/fate";
import { setAvatarImage } from "actions/myself";
import { newAvatarImage } from "actions/myself/setAvatarImage";

import Modal from "components/Modal";
import ConfirmModalReady from "components/PurchaseFaceModal/ConfirmModal/ConfirmModalReady";
import PurchaseResult from "components/PurchaseModal/PurchaseResult";

import getFaceChangeFateCard from "selectors/fate/getFaceChangeFateCard";
import getFaceChangeFateCost from "selectors/fate/getFaceChangeFateCost";
import getCanChangeFaceForFree from "selectors/myself/getCanChangeFaceForFree";

import { Either, Success } from "services/BaseMonadicService";
import { SetAvatarImageResponse } from "services/MyselfService";

import { useAppSelector } from "features/app/store";

enum AvatarConfirmModalStep {
  Ready,
  Complete,
  CompleteFree,
}

type Props = {
  avatar?: string;
  isOpen: boolean;
  onConfirm: () => void;
  onRequestClose: (_args?: any) => void;
  onRequestCloseModalStack: (_args?: any) => void;
};

export default function ConfirmModal({
  avatar,
  isOpen,
  onConfirm,
  onRequestClose,
  onRequestCloseModalStack,
}: Props) {
  const changeFaceFateCard = useAppSelector((state) =>
    getFaceChangeFateCard(state)
  );
  const fateCost = useAppSelector((state) => getFaceChangeFateCost(state));
  const isFree = useAppSelector((state) => getCanChangeFaceForFree(state));

  const dispatch: Function = useDispatch();

  const [currentStep, setCurrentStep] = useState<AvatarConfirmModalStep>(
    AvatarConfirmModalStep.Ready
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const resetState = useCallback(() => {
    setCurrentStep(AvatarConfirmModalStep.Ready);
    setIsSuccess(false);
    setIsSubmitting(false);
    setMessage(undefined);
  }, []);

  const handleConfirmPurchase = useCallback(async () => {
    if (!avatar) {
      console.error("Trying to purchase an undefined avatar");

      return;
    }

    setIsSubmitting(true);

    let result: Either<SetAvatarImageResponse> | undefined;

    if (isFree) {
      result = await dispatch(
        setAvatarImage({
          avatarImage: avatar,
        })
      );
    } else {
      if (!changeFaceFateCard) {
        console.error(
          "Trying to purchase an avatar, but can't find the Fate card"
        );

        return;
      }

      result = await dispatch(
        purchaseItem({
          avatarImage: avatar,
          storeItemId: changeFaceFateCard.id,
        })
      );
    }

    let responseMessage: string | undefined;

    if (result instanceof Success) {
      dispatch(newAvatarImage(avatar));

      responseMessage = result.data.message;
    } else {
      responseMessage = result?.message;
    }

    // Fetch up-to-date Fate info so that we can change cameo again without refreshing the page
    dispatch(fetchFate());
    dispatch(fetchActions());

    setIsSubmitting(false);
    setIsSuccess(true);
    setMessage(responseMessage);
    setCurrentStep(
      isFree
        ? AvatarConfirmModalStep.CompleteFree
        : AvatarConfirmModalStep.Complete
    );
    onConfirm();
  }, [avatar, changeFaceFateCard, dispatch, isFree, onConfirm]);

  const content = useMemo(() => {
    switch (currentStep) {
      case AvatarConfirmModalStep.CompleteFree:
        if (!avatar) {
          return null;
        }

        return (
          <PurchaseResult
            image={avatar}
            isSuccess={isSuccess}
            message={message ?? (isSuccess ? "Success" : "Failure")}
            name={avatar}
            onClick={onRequestCloseModalStack}
            type="cameo"
            isFree
          />
        );

      case AvatarConfirmModalStep.Complete:
        if (!avatar) {
          return null;
        }

        return (
          <PurchaseResult
            image={avatar}
            isSuccess={isSuccess}
            message={message ?? (isSuccess ? "Success" : "Failure")}
            name={avatar}
            onClick={onRequestCloseModalStack}
            type="cameo"
          />
        );

      default:
        return (
          <ConfirmModalReady
            avatar={avatar}
            fateCost={fateCost}
            isFree={isFree}
            isSubmitting={isSubmitting}
            onConfirm={handleConfirmPurchase}
          />
        );
    }
  }, [
    avatar,
    currentStep,
    fateCost,
    handleConfirmPurchase,
    isFree,
    isSubmitting,
    isSuccess,
    message,
    onRequestCloseModalStack,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={resetState}
      onRequestClose={onRequestClose}
    >
      {content}
    </Modal>
  );
}

ConfirmModal.displayName = "ConfirmModal";
