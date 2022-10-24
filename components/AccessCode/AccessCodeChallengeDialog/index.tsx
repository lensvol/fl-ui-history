import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import ReactModal from "react-modal";

import {
  clearAccessCodeChallenge,
  processAccessCode,
} from "actions/accessCodes";
import { ThunkDispatch } from "redux-thunk";
import { IAppState } from "types/app";

import ModalContent from "./ModalContent";

type State = {
  modalIsOpen: boolean;
};

class AccessCodeChallengeDialog extends Component<Props, State> {
  static displayName = "AccessCodeChallengeDialog";

  state = {
    modalIsOpen: false,
  };

  componentDidMount() {
    const { displayChallenge, loggedIn } = this.props;
    this.setState({ modalIsOpen: displayChallenge && loggedIn });
  }

  componentDidUpdate = (prevProps: Props) => {
    const { displayChallenge, loggedIn } = this.props;
    if (
      prevProps.displayChallenge !== displayChallenge ||
      prevProps.loggedIn !== loggedIn
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ modalIsOpen: displayChallenge && loggedIn });
    }
  };

  handleClick = async () => {
    const { accessCode, dispatch } = this.props;
    if (accessCode) {
      await dispatch(processAccessCode(accessCode.name));
    }
    dispatch(clearAccessCodeChallenge());
  };

  render() {
    const { accessCode, isFetching } = this.props;
    const { modalIsOpen } = this.state;

    return (
      <ReactModal
        isOpen={modalIsOpen}
        className={classnames(
          "modal--tooltip-like__content",
          "modal--access-code-challenge"
        )}
        overlayClassName={classnames(
          "modal--tooltip-like__overlay",
          "modal__overlay--has-visible-backdrop",
          "modal__overlay--has-transition"
        )}
      >
        {isFetching ? null : (
          <ModalContent
            image={accessCode?.image}
            message={accessCode?.initialMessage}
            onClick={this.handleClick}
          />
        )}
      </ReactModal>
    );
  }
}

const mapStateToProps = ({
  accessCodes: { accessCode, displayChallenge, isFetching },
  user: { loggedIn },
}: IAppState) => ({
  accessCode,
  displayChallenge,
  isFetching,
  loggedIn,
});

type Props = ReturnType<typeof mapStateToProps> & {
  dispatch: ThunkDispatch<any, any, any>;
};

export default connect(mapStateToProps)(AccessCodeChallengeDialog);
