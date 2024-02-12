import React from "react";

import EmailAuth from "components/Account/AuthMethods/EmailAuth";
import Modal from "components/Modal";

type Props = {
  isOpen: boolean;
  onRequestClose: () => void;
};

export default function EmailVerificationModal({
  isOpen,
  onRequestClose,
}: Props) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div>
        <h2 className="heading heading--2">Verify your email address</h2>
        <p>
          You will need to verify your email address before you can participate
          in Social Acts.
        </p>

        <EmailAuth
          buttonClassName="button--link-inverse"
          onLinkSuccess={onRequestClose}
          showVerificationLink
        />
      </div>
    </Modal>
  );
}
