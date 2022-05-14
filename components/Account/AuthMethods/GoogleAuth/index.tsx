import React, {
  useCallback,
  useState,
} from 'react';
import Modal from 'components/Modal';
import GoogleAuthComponent from './GoogleAuthComponent';

export default function GoogleAuth({
  inverse,
}: Props) {
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
      <ResultModal
        isOpen={isResultModalOpen}
        message={message}
        onAfterClose={() => setMessage(undefined)}
        onRequestClose={() => setIsResultOpenModal(false)}
      />
    </>
  );
}

type Props = {
  inverse?: boolean,
};

function ResultModal({
  isOpen,
  message,
  onAfterClose,
  onRequestClose,
}: {
  isOpen: boolean,
  message: string | undefined,
  onAfterClose: () => void,
  onRequestClose: () => void,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onAfterClose={onAfterClose}
      onRequestClose={onRequestClose}
    >
      {message}
    </Modal>
  );
}