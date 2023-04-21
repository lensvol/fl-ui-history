import React, { useCallback } from "react";
import { connect } from "react-redux";

import {
  INVITATION_FROM_YOU,
  INVITATION_TO_YOU,
  SOCIAL_MESSAGE,
  STORYLET_MESSAGE,
} from "constants/messageTypes";

import { deleteMessage, emailMessage } from "actions/messages";
import { showAccountLinkReminder } from "actions/accountLinkReminder";
import { ThunkDispatch } from "redux-thunk";
import { IAppState } from "types/app";
import { FeedMessage } from "types/messages";

import SocialMessage from "./SocialMessage";
import StoryletMessage from "./StoryletMessage";
import InvitationFromYou from "./InvitationFromYou";
import InvitationToYou from "./InvitationToYou";

import MessageComponent from "./MessageComponent";

function MessageContainer(props: Props) {
  const { data, disabled, dispatch } = props;

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
      return (
        <InvitationToYou
          data={data}
          disabled={disabled}
          onEmail={handleEmail}
        />
      );
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
          onDelete={handleDelete}
          emailable
          onEmail={handleEmail}
        />
      );
  }
}

const mapStateToProps = ({
  messages: { isRequesting: disabled },
}: IAppState) => ({ disabled });

type Props = ReturnType<typeof mapStateToProps> & {
  data: FeedMessage;
  dispatch: ThunkDispatch<any, any, any>;
};

export default connect(mapStateToProps)(MessageContainer);
