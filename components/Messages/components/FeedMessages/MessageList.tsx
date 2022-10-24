import React from "react";

import Loading from "components/Loading";
import Message from "../Message";

export default function MessageList({ messages }: Props) {
  if (!messages) {
    return <Loading />;
  }
  if (messages.length) {
    return (
      <div>
        {messages.map((message) => (
          <Message key={message.relatedId} data={message} />
        ))}
      </div>
    );
  }
  return <p>No messages</p>;
}

type Props = {
  messages: any[];
};
