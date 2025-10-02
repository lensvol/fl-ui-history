import React, { useCallback, useState } from "react";

import GoogleAuthComponent from "components/Account/AuthMethods/GoogleAuth/GoogleAuthComponent";
import Modal from "components/Modal";

export default function GoogleAuth({ inverse }: Props) {
  const [isResultModalOpen, setIsResultOpenModal] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const handleFailure = useCallback((failureMessage: string) => {
    setMessage(failureMessage);
    setIsResultOpenModal(true);
  }, []);

  return (
    <>
      <GoogleAuthComponent
        inverse={inverse}
        onLinkFailure={handleFailure}
        onUnlinkFailure={handleFailure}
      />
      <Modal
        isOpen={isResultModalOpen}
        onAfterClose={() => setMessage(undefined)}
        onRequestClose={() => setIsResultOpenModal(false)}
      >
        {message}
      </Modal>
    </>
  );
}

GoogleAuth.displayName = "GoogleAuth";

type Props = {
  inverse?: boolean;
};
