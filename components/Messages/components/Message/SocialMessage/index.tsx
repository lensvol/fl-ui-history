import React, { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { beginSocialEvent } from "actions/storylet";

import Loading from "components/Loading";
import MessageComponent from "components/Messages/components/Message/MessageComponent";
import PrimaryButton from "components/Messages/components/Message/PrimaryButton";

import { useAppSelector } from "features/app/store";

import useIsMounted from "hooks/useIsMounted";

import { VersionMismatch } from "services/BaseService";

import { FeedMessage } from "types/messages";
import { BeginSocialEventResponse } from "types/storylet";

type Props = {
  data: FeedMessage;
  disabled?: boolean;
  onEmail?: (hasMessagingEmail: boolean) => Promise<void>;
};

export default function SocialMessage({ data, disabled, onEmail }: Props) {
  const { relatedId: invitationId } = data;

  const dispatch = useDispatch();
  const history = useHistory();
  const mounted = useIsMounted();

  const [isWorking, setIsWorking] = useState(false);

  const inProgressInvitationId = useAppSelector(
    (state) => state.messages.invitationId
  );

  const isDisabled = useMemo(() => {
    return !!disabled || inProgressInvitationId === invitationId;
  }, [disabled, inProgressInvitationId, invitationId]);

  const handleClick = useCallback(async () => {
    if (!invitationId) {
      return;
    }

    setIsWorking(true);

    const responseData: BeginSocialEventResponse | VersionMismatch =
      await beginSocialEvent(invitationId)(dispatch);

    if (isBeginSocialEventResponse(responseData) && responseData.isSuccess) {
      history.push("/");
    }

    if (mounted.current) {
      setIsWorking(false);
    }

    function isBeginSocialEventResponse(
      r: BeginSocialEventResponse | VersionMismatch
    ): r is BeginSocialEventResponse {
      return (r as BeginSocialEventResponse).isSuccess !== undefined;
    }
  }, [dispatch, history, invitationId, mounted]);

  return (
    <MessageComponent data={data} emailable onEmail={onEmail}>
      <PrimaryButton disabled={isDisabled} onClick={handleClick}>
        {isWorking ? <Loading spinner small /> : <span>Respond</span>}
      </PrimaryButton>
    </MessageComponent>
  );
}

SocialMessage.displayName = "SocialMessage";
