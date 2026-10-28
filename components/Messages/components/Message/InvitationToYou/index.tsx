import React, { useCallback, useState } from "react";

import { useDispatch } from "react-redux";

import { acceptInvitation, rejectInvitation } from "actions/messages";
import { fetchMyself } from "actions/myself";

import ActionButton from "components/ActionButton";
import Loading from "components/Loading";
import FailureModal from "components/Messages/components/Message/InvitationToYou/FailureModal";
import MessageComponent from "components/Messages/components/Message/MessageComponent";
import TertiaryButton from "components/Messages/components/Message/TertiaryButton";

import { useAppSelector } from "features/app/store";

import { Failure } from "services/BaseMonadicService";

import { FeedMessage } from "types/messages";

type Props = {
  data: FeedMessage;
  onEmail: (hasMessagingEmail: boolean) => Promise<void>;
};

export default function InvitationToYou({ data, onEmail }: Props) {
  const [failureMessage, setFailureMessage] = useState<string | undefined>(
    undefined
  );
  const [isAccepting, setIsAccepting] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const actions = useAppSelector((state) => state.actions.actions);
  const isRequesting = useAppSelector((state) => state.messages.isRequesting);

  const dispatch = useDispatch();

  const handleAccept = useCallback(async () => {
    const { relatedId: invitationId } = data;

    if (!invitationId) {
      return;
    }

    setIsAccepting(true);

    const result = await dispatch(acceptInvitation(invitationId));

    dispatch(fetchMyself());

    setIsAccepting(false);

    if (result instanceof Failure) {
      setIsFailureModalOpen(true);
      setFailureMessage(result.message);
    }
  }, [data, dispatch]);

  const handleReject = useCallback(async () => {
    const { relatedId: invitationId } = data;

    setIsRejecting(true);

    await dispatch(rejectInvitation(invitationId));

    setIsRejecting(false);
  }, [data, dispatch]);

  const handleAfterCloseFailureModal = useCallback(() => {
    setFailureMessage(undefined);
  }, []);

  const handleRequestCloseFailureModal = useCallback(() => {
    setIsFailureModalOpen(false);
  }, []);

  const disabled = isRequesting || isAccepting || isRejecting;

  // Build a 'data' object for the ActionButton for simple messages
  const actionData = {
    actionLocked: actions <= 0,
    buttonText: "Accept",
    isLocked: actions <= 0,
  };

  return (
    <>
      <MessageComponent data={data} emailable onEmail={onEmail}>
        <TertiaryButton disabled={disabled} onClick={handleReject}>
          {isRejecting ? <Loading spinner small /> : <span>Reject</span>}
        </TertiaryButton>

        <ActionButton
          data={actionData}
          disabled={disabled}
          onClick={handleAccept}
          suppressUnlockButton
        >
          {isAccepting && <Loading spinner small />}
        </ActionButton>
      </MessageComponent>

      <FailureModal
        isOpen={isFailureModalOpen}
        message={failureMessage}
        onAfterClose={handleAfterCloseFailureModal}
        onRequestClose={handleRequestCloseFailureModal}
      />
    </>
  );
}

InvitationToYou.displayName = "InvitationToYou";
