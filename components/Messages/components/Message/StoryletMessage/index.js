import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { begin } from "actions/storylet";

import MessageComponent from "../MessageComponent";
import PrimaryButton from "../PrimaryButton";

export class StoryletMessage extends Component {
  mounted = false;

  state = {};

  componentDidMount = () => {
    this.mounted = true;
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  handleClick = () => {
    const {
      dispatch,
      history,
      data: { relatedId: eventId }, // TODO: is this the correct eventId??
    } = this.props;
    dispatch(begin(eventId)).then(() => {
      history.push("/");
    });
  };

  render = () => {
    const { data, onEmail } = this.props;
    return (
      <MessageComponent data={data} emailable onEmail={onEmail}>
        <PrimaryButton onClick={this.handleClick}>Go</PrimaryButton>
      </MessageComponent>
    );
  };
}

StoryletMessage.propTypes = {
  data: PropTypes.shape({}).isRequired,
  dispatch: PropTypes.func.isRequired,
  onEmail: PropTypes.func.isRequired,
};

export default connect()(StoryletMessage);
