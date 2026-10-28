import React, { useCallback } from "react";

import { useDispatch } from "react-redux";

import { clearNotification, closeDialog } from "actions/messages";
import { setTab } from "actions/subtabs";

import Dialog from "components/Dialog";
import FeedMessages from "components/Messages/components/FeedMessages";
import MessageInnerTabs from "components/Messages/components/MessageInnerTabs";
import MediaMdUp from "components/Responsive/MediaMdUp";
import MediaSmDown from "components/Responsive/MediaSmDown";

import { useAppSelector } from "features/app/store";

export default function Messages() {
  const dispatch = useDispatch();

  const dialogMessage = useAppSelector((state) => state.messages.dialogMessage);
  const dialogOpen = useAppSelector((state) => state.messages.dialogOpen);
  const subtab = useAppSelector((state) => state.subtabs.messages);

  const clearNotifications = useCallback(() => {
    return dispatch(clearNotification());
  }, [dispatch]);

  const onCloseDialog = useCallback(() => {
    return dispatch(closeDialog());
  }, [dispatch]);

  const switchTab = useCallback(
    (newSubtab) => {
      return dispatch(
        setTab({
          subtab: newSubtab,
          tab: "messages",
        })
      );
    },
    [dispatch]
  );

  return (
    <div onClick={clearNotifications}>
      <MediaSmDown>
        <MessageInnerTabs activeTab={subtab} onChange={switchTab} />

        <div className="messages">
          <FeedMessages type={subtab} />
        </div>
      </MediaSmDown>

      <MediaMdUp>
        <div className="messages">
          <FeedMessages type="interactions" />

          <FeedMessages type="feedMessages" />
        </div>
      </MediaMdUp>

      {dialogOpen && (
        <Dialog isOpen={dialogOpen} onRequestClose={onCloseDialog}>
          <div>
            <h1 className="travel__message heading heading--1">Warning!</h1>

            <p>{dialogMessage}</p>
          </div>
        </Dialog>
      )}
    </div>
  );
}

Messages.displayName = "Messages";
