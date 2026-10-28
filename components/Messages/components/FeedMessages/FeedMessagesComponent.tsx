import React from "react";

import FeedMessageControls from "components/Messages/components/FeedMessages/FeedMessageControls";
import MessageList from "components/Messages/components/FeedMessages/MessageList";

import { useAppSelector } from "features/app/store";

type Props = {
  title: string;
  type: "feedMessages" | "interactions";
};

export default function FeedMessagesComponent({ title, type }: Props) {
  const messages = useAppSelector((state) => state.messages[type]);

  return (
    <div
      className="message"
      style={{
        marginBottom: "10px",
      }}
    >
      <h1
        className="heading heading--1 messages__heading"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {title}

        {type !== "feedMessages" && <FeedMessageControls />}
      </h1>

      <MessageList messages={messages} />
    </div>
  );
}

FeedMessagesComponent.displayName = "FeedMessagesComponent";
