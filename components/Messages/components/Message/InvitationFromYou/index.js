import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { cancel as cancelInvitation } from "actions/messages";

import Loading from "components/Loading";

import MessageComponent from "../MessageComponent";
import TertiaryButton from "../TertiaryButton";

export class InvitationFromYou extends Component {
  mounted = false;

  state = {
    isCancelling: false,
  };

  componentDidMount = () => {
    this.mounted = true;
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleClick = async () => {
    const {
      data: { relatedId: eventId },
      dispatch,
    } = this.props;
    if (!eventId) {
      return;
    }

    this.setState({ isCancelling: true });
    await dispatch(cancelInvitation(eventId));
    if (this.mounted) {
      this.setState({ isCancelling: false });
    }
  };

  render = () => {
    const { data, disabled, onEmail } = this.props;
    const { isCancelling } = this.state;
    return (
      <MessageComponent data={data} emailable onEmail={onEmail}>
        <TertiaryButton disabled={disabled} onClick={this.handleClick}>
          {isCancelling ? <Loading spinner small /> : "Cancel"}
        </TertiaryButton>
      </MessageComponent>
    );
  };
}

InvitationFromYou.propTypes = {
  data: PropTypes.shape({
    relatedId: PropTypes.number,
  }).isRequired,
  disabled: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  onEmail: PropTypes.func.isRequired,
};

export default connect()(InvitationFromYou);
