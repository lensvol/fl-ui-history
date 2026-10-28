import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import { cancelInvitation } from "actions/messages";

import Loading from "components/Loading";
import MessageComponent from "components/Messages/components/Message/MessageComponent";
import TertiaryButton from "components/Messages/components/Message/TertiaryButton";

import { FeedMessage } from "types/messages";

type Props = {
  data: FeedMessage;
  disabled: boolean;
  onEmail: (hasMessagingEmail: boolean) => Promise<void>;
};

export default function InvitationFromYou({ data, disabled, onEmail }: Props) {
  const dispatch = useDispatch();

  const [isCancelling, setIsCancelling] = useState(false);

  const handleClick = useCallback(async () => {
    const { relatedId: eventId } = data;

    if (!eventId) {
      return;
    }

    setIsCancelling(true);

    await dispatch(cancelInvitation(eventId));

    setIsCancelling(false);
  }, [data, dispatch]);

  return (
    <MessageComponent data={data} emailable onEmail={onEmail}>
      <TertiaryButton disabled={disabled} onClick={handleClick}>
        {isCancelling ? <Loading spinner small /> : "Cancel"}
      </TertiaryButton>
    </MessageComponent>
  );
}

InvitationFromYou.displayName = "InvitationFromYou";
