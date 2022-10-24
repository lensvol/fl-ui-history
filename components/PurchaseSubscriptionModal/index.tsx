import React from "react";

import Modal from "components/Modal";
import PurchaseSubscriptionWizard from "components/PurchaseSubscriptionWizard";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
}

export default function PurchaseSubscriptionModal({
  isOpen,
  onRequestClose,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
    >
      <PurchaseSubscriptionWizard onClickToClose={onRequestClose} />
    </Modal>
  );
}
