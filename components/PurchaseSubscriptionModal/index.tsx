import React from "react";

import Modal from "components/Modal";
import PurchaseSubscriptionWizard from "components/PurchaseSubscriptionWizard";

import { PremiumSubscriptionType } from "types/subscription";

interface Props {
  hasSubscription: boolean;
  isOpen: boolean;
  onRequestClose: () => void;
  renewDate?: string;
  subscriptionType?: PremiumSubscriptionType;
}

export default function PurchaseSubscriptionModal({
  hasSubscription,
  isOpen,
  onRequestClose,
  renewDate,
  subscriptionType,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      className="modal-dialog--purchase-fate"
    >
      <PurchaseSubscriptionWizard
        hasSubscription={hasSubscription}
        onClickToClose={onRequestClose}
        renewDate={renewDate}
        subscriptionType={subscriptionType}
      />
    </Modal>
  );
}
