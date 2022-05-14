import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormikHelpers as FormikActions } from 'formik';

import { resetPassword } from 'actions/settings';
import PasswordResetModalComponent from './PasswordResetModalComponent';

type Props = {
  dispatch: Function, // eslint-disable-line
  isOpen: boolean,
  onRequestClose: () => void,
  token: string | undefined,
};

export class PasswordResetModalContainer extends Component<Props> {
  handleSubmit = ({ password }: { password: string }, actions: FormikActions<{ password: string }>) => {
    const { dispatch, token } = this.props;
    if (!(password && token)) {
      actions.setSubmitting(false);
      return;
    }
    dispatch(resetPassword({ password, token }));
  };

  render = () => {
    const { isOpen, onRequestClose } = this.props;
    return (
      <PasswordResetModalComponent
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default connect()(PasswordResetModalContainer);