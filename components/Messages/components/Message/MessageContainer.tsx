import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { showAccountLinkReminder } from "actions/accountLinkReminder";
import { deleteMessage, emailMessage } from "actions/messages";

import InvitationFromYou from "components/Messages/components/Message/InvitationFromYou";
import InvitationToYou from "components/Messages/components/Message/InvitationToYou";
import MessageComponent from "components/Messages/components/Message/MessageComponent";
import SocialMessage from "components/Messages/components/Message/SocialMessage";
import StoryletMessage from "components/Messages/components/Message/StoryletMessage";

import {
  INVITATION_FROM_YOU,
  INVITATION_TO_YOU,
  SOCIAL_MESSAGE,
  STORYLET_MESSAGE,
} from "constants/messageTypes";

import { useAppSelector } from "features/app/store";

import { FeedMessage } from "types/messages";

type Props = {
  data: FeedMessage;
};

export default function MessageContainer({ data }: Props) {
  const dispatch = useDispatch();

  const disabled = useAppSelector((state) => state.messages.isRequesting);

  const { relatedId } = data;

  const handleDelete = useCallback(async () => {
    const id = relatedId;

    if (!id && id !== 0) {
      return; // no message id
    }

    await dispatch(deleteMessage(id));
  }, [dispatch, relatedId]);

  const handleEmail = useCallback(
    async (hasMessagingEmail: boolean) => {
      if (hasMessagingEmail) {
        const id = relatedId;

        if (!id && id !== 0) {
          return; // no message id
        }

        dispatch(emailMessage(id));
      } else {
        // show user prompt for additional login methods
        dispatch(showAccountLinkReminder());
      }
    },
    [dispatch, relatedId]
  );

  switch (data.type) {
    case INVITATION_FROM_YOU:
      return (
        <InvitationFromYou
          data={data}
          disabled={disabled}
          onEmail={handleEmail}
        />
      );

    case INVITATION_TO_YOU:
      return <InvitationToYou data={data} onEmail={handleEmail} />;

    case SOCIAL_MESSAGE:
      return (
        <SocialMessage data={data} disabled={disabled} onEmail={handleEmail} />
      );

    case STORYLET_MESSAGE:
      return (
        <StoryletMessage
          data={data}
          disabled={disabled}
          onEmail={handleEmail}
        />
      );

    default:
      return (
        <MessageComponent
          data={data}
          deletable
          emailable
          onDelete={handleDelete}
          onEmail={handleEmail}
        />
      );
  }
}

MessageContainer.displayName = "MessageContainer";
