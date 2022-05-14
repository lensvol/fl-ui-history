import React from 'react';
import PropTypes from 'prop-types';

import Loading from 'components/Loading';
import Modal from 'components/Modal';

interface Props {
  isFetching: boolean,
  isOpen: boolean,
  onConfirm: () => void,
  onRequestClose: () => void,
}

export default function DeleteDialog(props: Props) {
  const {
    isFetching,
    isOpen,
    onConfirm,
    onRequestClose,
  } = props;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <div>
        <h2 className="heading heading--2 heading--inverse">
          Delete this entry?
        </h2>
        <hr />
        <div className="modal__body">
          <p>
            Are you sure you want to delete this entry?
          </p>
        </div>
        <div className="buttons">
          <button
            className="button button--primary"
            disabled={isFetching}
            onClick={onConfirm}
            type="button"
          >
            {isFetching ? <Loading spinner small /> : 'Delete'}
          </button>
          <button
            className="button button--primary"
            disabled={isFetching}
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

DeleteDialog.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};