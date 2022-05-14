import React, { Component } from 'react';
import { deactivateAccount } from 'actions/settings';
import { logoutUser } from 'actions/user';

import Modal from 'components/Modal';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import {
  CORRECT_CONFIRMATION_REGEX,
  CORRECT_CONFIRMATION_TEXT,
} from './constants';

type OwnProps = {
  dispatch: ThunkDispatch<any, any, any>,
  isOpen: boolean,
  onRequestClose: () => void,
};

type Props = OwnProps;

type State = {
  canDeactivate: boolean,
  confirmationText: string,
};

export class DeactivateAccountModalContainer extends Component<Props, State> {
  state = {
    canDeactivate: false,
    confirmationText: '',
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      confirmationText: e.target.value,
      canDeactivate: CORRECT_CONFIRMATION_REGEX.test(e.target.value.trim()),
    });
  };

  handleDeactivate = async () => {
    const { dispatch, onRequestClose } = this.props;
    const { canDeactivate } = this.state;
    if (!canDeactivate) {
      return;
    }
    await dispatch(deactivateAccount());
    onRequestClose();
    logoutUser()(dispatch);
  };

  render = () => {
    const { isOpen, onRequestClose } = this.props;
    const { canDeactivate, confirmationText } = this.state;

    const onChange = this.handleChange;
    const onDeactivate = this.handleDeactivate;

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="media__heading heading heading--3">Are you sure?</h2>
          <p>
            This will permanently remove your user account and all characters in Fallen London (and
            all other StoryNexus worlds) attached to it.
          </p>
          <p>
            To proceed with deactivating, type
            {' '}
            <b>{CORRECT_CONFIRMATION_TEXT}</b>
            {' '}
            (all lower case) here:
          </p>
          <input
            className="form__control form__control--has-buttons"
            onChange={onChange}
            type="text"
            value={confirmationText}
          />
          <div className="buttons">
            <button
              className="button button--dangerous"
              disabled={!canDeactivate}
              onClick={onDeactivate}
              type="button"
            >
              Deactivate
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default connect()(DeactivateAccountModalContainer);
