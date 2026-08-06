import React, { useEffect, useState } from "react";

import ReactCSSTransitionReplace from "react-css-transition-replace";

import { useDispatch } from "react-redux";

import { fetch as fetchMessages } from "actions/messages";

import GeneralContainer from "components/GeneralContainer";
import Loading from "components/Loading";
import Messages from "components/Messages";

import { useAppSelector } from "features/app/store";

export default function MessagesContainer() {
  const feedMessages = useAppSelector((state) => state.messages.feedMessages);
  const interactions = useAppSelector((state) => state.messages.interactions);
  const isFetching = useAppSelector((state) => state.messages.isFetching);

  const dispatch = useDispatch();

  const [didLoad, setDidLoad] = useState(false);

  useEffect(() => {
    if (didLoad) {
      return;
    }

    if (isFetching) {
      return;
    }

    // If we aren't fetching, and we don't have the expected state shape, then fetch messages
    if (!feedMessages.length && !interactions.length) {
      dispatch(fetchMessages());
    }

    setDidLoad(true);
  }, [didLoad, dispatch, feedMessages, interactions, isFetching]);

  return (
    <GeneralContainer>
      <ReactCSSTransitionReplace
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
        transitionName="fade-wait"
      >
        {isFetching ? <Loading key="loading" /> : <Messages key="messages" />}
      </ReactCSSTransitionReplace>
    </GeneralContainer>
  );
}

MessagesContainer.displayName = "MessagesContainer";
