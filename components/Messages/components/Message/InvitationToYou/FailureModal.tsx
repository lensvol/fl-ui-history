import React from "react";

import Modal from "components/Modal";

type Props = {
  isOpen: boolean;
  message: string | undefined;
  onAfterClose: () => void;
  onRequestClose: () => void;
};

export default function FailureModal({
  isOpen,
  message,
  onAfterClose,
  onRequestClose,
}: Props) {
  return (
    <Modal
      isOpen={isOpen && message !== undefined}
      onAfterClose={onAfterClose}
      onRequestClose={onRequestClose}
    >
      {message}
    </Modal>
  );
}
