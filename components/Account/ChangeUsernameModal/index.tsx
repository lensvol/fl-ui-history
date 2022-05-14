import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'components/Modal';

import { changeUsername } from 'actions/settings';
import { FormikHelpers as FormikActions } from 'formik';
import { ThunkDispatch } from 'redux-thunk';
import CompleteMessage from './CompleteMessage';
import ChangeUsernameForm from './ChangeUsernameForm';

type State = {
  isComplete: boolean,
  successMessage?: string,
};

type Props = {
  dispatch: ThunkDispatch<any, any, any>,
  isOpen: boolean,
  onRequestClose: () => void,
};

const INITIAL_STATE: State = {
  isComplete: false,
};

export class ChangeUsernameModalContainer extends Component<Props, State> {
  state = { ...INITIAL_STATE };

  handleRequestClose = () => {
    const { onRequestClose } = this.props;
    // Clean up before we close
    this.setState({ ...INITIAL_STATE });
    onRequestClose();
  };

  handleSubmit = async (
    { username }: { username: string },
    { setSubmitting, setErrors }: FormikActions<{ username: string }>,
  ) => {
    const { dispatch } = this.props;
    const { isSuccess, message } = await changeUsername(username)(dispatch);
    setSubmitting(false);
    if (isSuccess) {
      this.setState({ isComplete: true });
      return;
    }
    // Uh-oh, we have an error
    setErrors({ username: message });
  };

  render = () => {
    const { isOpen } = this.props;
    const { isComplete } = this.state;
    const onRequestClose = this.handleRequestClose;
    const onSubmit = this.handleSubmit;
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
      >
        {isComplete ? <CompleteMessage /> : <ChangeUsernameForm onSubmit={onSubmit} />}
      </Modal>
    );
  }
}

export default connect()(ChangeUsernameModalContainer);
