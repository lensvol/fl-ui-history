import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/Modal';

export default class ConfirmRefreshModal extends Component {
  renderContent = () => {
    const { onConfirm, onRequestClose, playerHasMaximumActivePlans } = this.props;
    if (playerHasMaximumActivePlans) {
      return (
        <div>
          <h3 className="heading heading--2" style={{ color: '#000' }}>Too many active plans!</h3>
          <p>Regrettably, you already have the maximum allowable number of active plans (20).</p>
        </div>
      );
    }

    return (
      <div>
        <h3 className="heading heading--2" style={{ color: '#000' }}>Are you sure?</h3>
        <p>Do you want to refresh this plan?</p>
        <div className="buttons">
          <button type="button" className="button button--primary" onClick={onConfirm}>Restart</button>
          <button type="button" className="button button--primary" onClick={onRequestClose}>Cancel</button>
        </div>
      </div>
    );
  }

  render = () => {
    const {
      isOpen,
      onRequestClose,
    } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

ConfirmRefreshModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  playerHasMaximumActivePlans: PropTypes.bool.isRequired,
};