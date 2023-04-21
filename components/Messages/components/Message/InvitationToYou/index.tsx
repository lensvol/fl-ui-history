import React, { Component } from "react";
import { connect } from "react-redux";

import {
  accept as acceptInvitation,
  reject as rejectInvitation,
} from "actions/messages";

import { fetchMyself } from "actions/myself";

import ActionButton from "components/ActionButton";
import Loading from "components/Loading";
import { Failure } from "services/BaseMonadicService";
import { IAppState } from "types/app";
import { FeedMessage } from "types/messages";

import FailureModal from "./FailureModal";
import TertiaryButton from "../TertiaryButton";
import MessageComponent from "../MessageComponent";

type State = {
  failureMessage: string | undefined;
  isAccepting: boolean;
  isFailureModalOpen: boolean;
  isRejecting: boolean;
};

export class InvitationToYou extends Component<Props, State> {
  mounted = false;

  state = {
    failureMessage: undefined,
    isAccepting: false,
    isFailureModalOpen: false,
    isRejecting: false,
  };

  componentDidMount = () => {
    this.mounted = true;
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleAccept = async () => {
    const {
      data: { relatedId: invitationId },
      dispatch,
    } = this.props;
    if (!invitationId) {
      return;
    }
    this.setState({ isAccepting: true });
    const result = await dispatch(acceptInvitation(invitationId));
    dispatch(fetchMyself());
    if (this.mounted) {
      this.setState({ isAccepting: false });
      if (result instanceof Failure) {
        this.setState({
          isFailureModalOpen: true,
          failureMessage: result.message,
        });
      }
    }
  };

  handleReject = async () => {
    const {
      dispatch,
      data: { relatedId: invitationId },
    } = this.props;
    this.setState({ isRejecting: true });
    await dispatch(rejectInvitation(invitationId));
    if (this.mounted) {
      this.setState({ isRejecting: false });
    }
  };

  handleAfterCloseFailureModal = () => {
    this.setState({ failureMessage: undefined });
  };

  handleRequestCloseFailureModal = () => {
    this.setState({
      isFailureModalOpen: false,
    });
  };

  render = () => {
    const { actions, data, isRequesting, onEmail } = this.props;
    const { failureMessage, isAccepting, isFailureModalOpen, isRejecting } =
      this.state;

    const disabled = isRequesting || isAccepting || isRejecting;

    // Build a 'data' object for the ActionButton for simple messages
    const actionData = {
      actionLocked: actions <= 0,
      buttonText: "Accept",
      isLocked: actions <= 0,
    };

    return (
      <>
        <MessageComponent data={data} emailable onEmail={onEmail}>
          <TertiaryButton disabled={disabled} onClick={this.handleReject}>
            {isRejecting ? <Loading spinner small /> : <span>Reject</span>}
          </TertiaryButton>
          <ActionButton
            disabled={disabled}
            suppressUnlockButton
            data={actionData}
            onClick={this.handleAccept}
          >
            {isAccepting && <Loading spinner small />}
          </ActionButton>
        </MessageComponent>
        <FailureModal
          isOpen={isFailureModalOpen}
          message={failureMessage}
          onAfterClose={this.handleAfterCloseFailureModal}
          onRequestClose={this.handleRequestCloseFailureModal}
        />
      </>
    );
  };
}

const mapStateToProps = ({
  actions: { actions },
  messages: { isRequesting },
}: IAppState) => ({
  actions,
  isRequesting,
});

type Props = ReturnType<typeof mapStateToProps> & {
  disabled: boolean;
  dispatch: Function; // eslint-disable-line
  data: FeedMessage;
  onEmail: (hasMessagingEmail: boolean) => Promise<void>;
};

export default connect(mapStateToProps)(InvitationToYou);
