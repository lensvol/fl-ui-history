import React from "react";
import { Props as ModalProps } from "react-modal";
import Modal from "components/Modal";
import BraintreeView from "components/Payment/components/BraintreeView";

export default function PurchaseFateModal({ isOpen, onRequestClose }: Props) {
  return (
    <Modal
      className="modal-dialog--purchase-fate"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <div className="purchase-panel">
        <BraintreeView onCancel={onRequestClose} />
      </div>
    </Modal>
  );
}

type Props = ModalProps & {
  onRequestClose: (_args?: any) => void;
};
