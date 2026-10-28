import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { closeDialog } from "actions/messages";

import Dialog from "components/Dialog";
import Loading from "components/Loading";
import Message from "components/Messages/components/Message";

import { useAppSelector } from "features/app/store";

type Props = {
  messages: any[];
};

export default function MessageList({ messages }: Props) {
  const dialogHeader = useAppSelector((state) => state.messages.dialogHeader);
  const dialogMessage = useAppSelector((state) => state.messages.dialogMessage);
  const dialogOpen = useAppSelector((state) => state.messages.dialogOpen);

  const dispatch = useDispatch();

  const onCloseDialog = useCallback(() => {
    return dispatch(closeDialog());
  }, [dispatch]);

  if (!messages) {
    return <Loading />;
  }

  if (messages.length === 0) {
    return <p>No messages</p>;
  }

  return (
    <div>
      {messages.map((message) => (
        <Message key={message.relatedId} data={message} />
      ))}

      {dialogOpen && (
        <Dialog isOpen={dialogOpen} onRequestClose={onCloseDialog}>
          <div>
            <h2 className="travel__message heading heading--1">
              {dialogHeader}
            </h2>

            <p>{dialogMessage}</p>
          </div>
        </Dialog>
      )}
    </div>
  );
}

MessageList.displayName = "MessageList";
