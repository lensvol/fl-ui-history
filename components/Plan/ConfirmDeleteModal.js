import React from "react";
import PropTypes from "prop-types";

import Modal from "components/Modal";

export default function ConfirmDeleteModal(props) {
  const { isOpen, onConfirm, onRequestClose } = props;
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div>
        <h3 className="heading heading--2" style={{ color: "#000" }}>
          Delete this plan?
        </h3>
        <p>Really delete this plan?</p>
        <div className="buttons">
          <button
            type="button"
            className="button button--primary"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            type="button"
            className="button button--primary"
            onClick={onRequestClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
