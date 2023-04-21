import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";

import { beginSocialEvent } from "actions/storylet";
import useIsMounted from "hooks/useIsMounted";
import Loading from "components/Loading";
import { VersionMismatch } from "services/BaseService";
import { FeedMessage } from "types/messages";
import { BeginSocialEventResponse } from "types/storylet";

import MessageComponent from "../MessageComponent";
import PrimaryButton from "../PrimaryButton";

type Props = RouteComponentProps & {
  data: FeedMessage;
  disabled?: boolean;
  dispatch: ThunkDispatch<any, any, any>;
  onEmail?: (hasMessagingEmail: boolean) => Promise<void>;
};

export function SocialMessage(props: Props) {
  const { data, disabled, dispatch, history, onEmail } = props;

  const { relatedId: invitationId } = data;

  const mounted = useIsMounted();

  const [isWorking, setIsWorking] = useState(false);

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
      <PrimaryButton disabled={!!disabled} onClick={handleClick}>
        {isWorking ? <Loading spinner small /> : <span>Respond</span>}
      </PrimaryButton>
    </MessageComponent>
  );
}

export default withRouter(connect()(SocialMessage));
