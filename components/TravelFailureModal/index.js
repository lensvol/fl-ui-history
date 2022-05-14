import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/Modal';

export default function TravelFailureModal({
  disableTouchEvents,
  isOpen,
  onRequestClose,
  message,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: { zIndex: 600 },
        content: { zIndex: 601 },
      }}
      disableTouchEvents={disableTouchEvents}
    >
      <div>
        <h1 className="travel__message heading heading--1">{message}</h1>
      </div>
    </Modal>
  );
}

TravelFailureModal.displayName = 'TravelFailureModal';

TravelFailureModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  message: PropTypes.string,
};

TravelFailureModal.defaultProps = {
  message: undefined,
};