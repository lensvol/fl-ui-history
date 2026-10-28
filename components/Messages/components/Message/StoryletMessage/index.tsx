import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { useHistory } from "react-router-dom";

import { begin } from "actions/storylet";

import MessageComponent from "components/Messages/components/Message/MessageComponent";
import PrimaryButton from "components/Messages/components/Message/PrimaryButton";

import { FeedMessage } from "types/messages";

type Props = {
  data: FeedMessage;
  disabled: boolean;
  onEmail: (hasMessagingEmail: boolean) => Promise<void>;
};

export default function StoryletMessage({ data, disabled, onEmail }: Props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClick = useCallback(async () => {
    const {
      relatedId: eventId, // TODO: is this the correct eventId??
    } = data;

    await dispatch(begin(eventId));

    history.push("/");
  }, [data, dispatch, history]);

  return (
    <MessageComponent data={data} emailable onEmail={onEmail}>
      <PrimaryButton disabled={disabled} onClick={handleClick}>
        Go
      </PrimaryButton>
    </MessageComponent>
  );
}

StoryletMessage.displayName = "StoryletMessage";
