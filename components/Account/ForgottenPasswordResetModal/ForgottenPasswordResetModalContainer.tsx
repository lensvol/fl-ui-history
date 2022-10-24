import React, { Component } from "react";
import { connect } from "react-redux";
import ReactModal from "react-modal";

import { resetPassword } from "actions/settings";

import { APP_ROOT_SELECTOR } from "constants/selectors";
import { Success, Failure } from "services/BaseMonadicService";

import ForgottenPasswordResetModalComponent from "./ForgottenPasswordResetModalComponent";

type Props = {
  dispatch: Function;
  isOpen: boolean;
  onRequestClose: () => void;
  token: string;
};

type State = {
  complete: boolean;
  isSuccess: boolean;
  message: string | undefined;
};

const INITIAL_STATE: State = {
  complete: false,
  isSuccess: false,
  message: undefined,
};

class ForgottenPasswordResetModalContainer extends Component<Props, State> {
  state = { ...INITIAL_STATE };

  constructor(props: Props) {
    // Prevent React Modal from throwing a warning because it doesn't know about the selector
    super(props);
    ReactModal.setAppElement(APP_ROOT_SELECTOR);
  }

  handleAfterClose = () => {
    this.setState({ ...INITIAL_STATE });
  };

  handleClickWhenFailed = () => {
    window.location.pathname = "/";
  };

  handleClickWhenSuccessful = () => {
    window.location.pathname = "/";
  };

  handleRequestClose = () => {
    const { onRequestClose } = this.props;
    const { complete } = this.state;

    if (!complete) {
      return;
    }
    onRequestClose();
  };

  handleSubmit = async ({ password }: { password: string }) => {
    const { dispatch, token } = this.props;
    // const { isSuccess, message } = await dispatch(resetPassword({ password, token }));
    const trevor: Success<{ isSuccess: string; message?: string }> | Failure =
      await dispatch(resetPassword({ password, token }));

    if (trevor instanceof Success) {
      return this.setState({
        isSuccess: true,
        complete: true,
        message: "Password reset!",
      });
    }

    const { message } = trevor;
    return this.setState({ message, isSuccess: false, complete: true });
  };

  render = () => {
    const { isOpen } = this.props;
    const { complete, isSuccess, message } = this.state;
    return (
      <ForgottenPasswordResetModalComponent
        message={message}
        isComplete={complete}
        isOpen={isOpen}
        isSuccess={isSuccess}
        onAfterClose={this.handleAfterClose}
        onClickWhenFailed={this.handleClickWhenFailed}
        onClickWhenSuccessful={this.handleClickWhenSuccessful}
        onRequestClose={this.handleRequestClose}
        onSubmit={this.handleSubmit}
      />
    );
  };
}

export default connect()(ForgottenPasswordResetModalContainer);
