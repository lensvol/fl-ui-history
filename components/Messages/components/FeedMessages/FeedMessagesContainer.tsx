import React, { Component } from "react";

import FeedMessagesComponent from "./FeedMessagesComponent";

export default class FeedMessagesContainer extends Component<Props> {
  static displayName = "FeedMessagesContainer";
  /**
   * Render
   * @return {Object}
   */
  render() {
    const { type } = this.props;

    const title = type === "feedMessages" ? "Recently" : "Messages";

    return <FeedMessagesComponent title={title} type={type} />;
  }
}

type Props = {
  type: "feedMessages" | "interactions";
};

FeedMessagesContainer.displayName = "FeedMessagesContainer";
