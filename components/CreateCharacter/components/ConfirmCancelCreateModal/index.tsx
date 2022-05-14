import React, {
  useCallback,
} from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';

import { logoutUser } from 'actions/user';

import Modal from 'components/Modal';

export function ConfirmCancelCreateModal({
  isOpen,
  onRequestClose,
}: Props) {
  const dispatch = useDispatch();

  const handleQuit = useCallback(() => {
    // Log the user out, removing their token; this will bring them back to login
    dispatch(logoutUser());
    onRequestClose();
  }, [dispatch, onRequestClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <div>
        <h1 className="heading heading--2 heading--inverse">
          Quit character creation?
        </h1>
        <p>
          Are you sure you want to quit and go back to login?
        </p>
        <div className="buttons">
          <button
            className="button button--primary"
            onClick={handleQuit}
            type="button"
          >
            Quit
          </button>
          <button
            className="button button--tertiary"
            onClick={onRequestClose}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

type Props = { isOpen: boolean, onRequestClose: () => void };

export default connect()(ConfirmCancelCreateModal);