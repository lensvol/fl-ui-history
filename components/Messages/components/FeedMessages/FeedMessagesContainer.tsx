import React from "react";

import FeedMessagesComponent from "components/Messages/components/FeedMessages/FeedMessagesComponent";

type Props = {
  type: "feedMessages" | "interactions";
};

export default function FeedMessagesContainer({ type }: Props) {
  const title = type === "feedMessages" ? "Recently" : "Messages";

  return <FeedMessagesComponent title={title} type={type} />;
}

FeedMessagesContainer.displayName = "FeedMessagesContainer";
