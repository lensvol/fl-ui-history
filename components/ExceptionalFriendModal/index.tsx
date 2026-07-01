/* eslint-disable no-console */
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { fetchMap } from "actions/map";
import { fetchAvailable } from "actions/storylet";

import Blurb from "components/ExceptionalFriendModal/Blurb";
import Modal from "components/Modal";
import PurchaseSubscriptionWizard from "components/PurchaseSubscriptionWizard";

import { useAppSelector } from "features/app/store";

import { ExceptionalFriendWizardStep } from "types/fate";

export interface Props {
  disableTouchEvents?: boolean;
  isOpen: boolean;
  onRequestClose: (_?: any) => void;
}

export default function ExceptionalFriendModal({
  disableTouchEvents,
  isOpen,
  onRequestClose,
}: Props) {
  const hasSubscription = useAppSelector(
    (state) => state.settings.subscriptions.hasBraintreeSubscription
  );
  const renewDate = useAppSelector(
    (state) => state.subscription.data?.renewDate
  );
  const subscriptionType = useAppSelector(
    (state) => state.settings.subscriptions.subscriptionType
  );

  const dispatch = useDispatch();

  const [wizardStep, setWizardStep] = useState(
    ExceptionalFriendWizardStep.Blurb
  );

  const handleRequestClose = useCallback(() => {
    onRequestClose(false);
  }, [onRequestClose]);

  const onNextFromSubscriptionSuccess = useCallback(() => {
    dispatch(fetchMap());
    dispatch(fetchAvailable());
    onRequestClose(true);
  }, [dispatch, onRequestClose]);

  const handleAfterClose = useCallback(() => {
    // Clean up internal state
    setWizardStep(ExceptionalFriendWizardStep.Blurb);
  }, []);

  const onNext = useCallback(
    (_message?: string) => {
      switch (wizardStep) {
        case ExceptionalFriendWizardStep.Blurb:
          setWizardStep(ExceptionalFriendWizardStep.Payment);

          return;

        case ExceptionalFriendWizardStep.Payment:
          onNextFromSubscriptionSuccess();

          return; // eslint-disable-line no-useless-return

        case ExceptionalFriendWizardStep.Success:
        case ExceptionalFriendWizardStep.Error:
        default:
          return; // eslint-disable-line no-useless-return
      }
    },
    [onNextFromSubscriptionSuccess, wizardStep]
  );

  const handleWizardClose = useCallback(
    (didUserCompleteSubscription: boolean | undefined) => {
      if (didUserCompleteSubscription) {
        onNext();

        return;
      }

      onRequestClose();
    },
    [onNext, onRequestClose]
  );

  const content = useMemo(() => {
    switch (wizardStep) {
      case ExceptionalFriendWizardStep.Payment:
        return (
          <PurchaseSubscriptionWizard
            hasSubscription={hasSubscription}
            onClickToClose={handleWizardClose}
            renewDate={renewDate}
            subscriptionType={subscriptionType}
          />
        );

      case ExceptionalFriendWizardStep.Blurb:
      default:
        return (
          <Blurb
            hasSubscription={hasSubscription}
            onNext={onNext}
            renewDate={renewDate}
            subscriptionType={subscriptionType}
          />
        );
    }
  }, [
    handleWizardClose,
    hasSubscription,
    onNext,
    renewDate,
    subscriptionType,
    wizardStep,
  ]);

  return (
    <Modal
      className="modal--map-exceptional-friend-modal__content"
      disableTouchEvents={disableTouchEvents}
      isOpen={isOpen}
      onAfterClose={handleAfterClose}
      onRequestClose={handleRequestClose}
      overlayClassName="modal--map-exceptional-friend-modal__overlay"
    >
      {content}
    </Modal>
  );
}

ExceptionalFriendModal.displayName = "ExceptionalFriendModal";
