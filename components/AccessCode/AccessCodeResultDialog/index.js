import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactModal from "react-modal";

import {
  clearAccessCodeResult,
  flushAccessCodeState,
} from "actions/accessCodes";

import CombinedMessage from "./components/CombinedMessage";

class AccessCodeResultDialog extends Component {
  state = {
    modalIsOpen: false,
  };

  componentDidMount() {
    const { message } = this.props;
    if (message) {
      this.setState({ modalIsOpen: true });
    }
  }

  componentDidUpdate(prevProps) {
    const { message } = this.props;
    if (message && message !== prevProps.message) {
      this.setState({ modalIsOpen: true });
    }
  }

  handleRequestClose = () => {
    const { dispatch, history } = this.props;
    this.setState({ modalIsOpen: false });
    dispatch(clearAccessCodeResult());
    dispatch(flushAccessCodeState());
    history.push("/");
  };

  render() {
    const { message, success } = this.props;
    const { modalIsOpen } = this.state;
    return (
      <ReactModal
        isOpen={modalIsOpen}
        className="modal--tooltip-like__content"
        overlayClassName="modal--tooltip-like__overlay modal__overlay--has-visible-backdrop"
        shouldCloseOnOverlayClick
      >
        <div>
          <CombinedMessage result={message} success={success} />
          <div className="buttons">
            <button
              className="button button--primary"
              onClick={this.handleRequestClose}
              type="button"
            >
              Onwards
            </button>
          </div>
        </div>
      </ReactModal>
    );
  }
}

AccessCodeResultDialog.displayName = "AccessCodeResultDialog";

const mapStateToProps = ({
  accessCodes: {
    result: { message, success },
  },
}) => ({ message, success });

export default withRouter(connect(mapStateToProps)(AccessCodeResultDialog));
